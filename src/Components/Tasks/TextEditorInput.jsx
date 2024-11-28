import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import ToolbarTextEditor from "./ToolbarTextEditor";
import ListItem from "@tiptap/extension-list-item";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import BulletList from "@tiptap/extension-bullet-list";
import Underline from "@tiptap/extension-underline";
import OrderedList from "@tiptap/extension-ordered-list";
import Link from "@tiptap/extension-link";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
const TextEditorInput = forwardRef(
  ({ onChange, showEmojiPicker, value, focus }, ref) => {
    const [selection, setSelection] = useState(null);
    const editor = useEditor({
      extensions: [
        Color.configure({ types: [TextStyle.name, ListItem.name] }),
        TextStyle.configure({ types: [ListItem.name] }),
        StarterKit.configure({
          bulletList: {
            keepMarks: true,
            keepAttributes: false,
            HTMLAttributes: {
              class: "list-disc",
            },
          },
          orderedList: {
            keepMarks: true,
            keepAttributes: false,
            HTMLAttributes: {
              class: "list-decimal",
            },
          },
          paragraph: {
            HTMLAttributes: {
              class: "text-gray-700 text-sm",
            },
          },
        }),
        BulletList,
        OrderedList,
        ListItem,
        Underline,
        Link.configure({
          openOnClick: false,
          autolink: true,
          defaultProtocol: "https",
          HTMLAttributes: {
            class: "cursor-pointer text-blue-500 italic underline",
            target: "_blank",
            rel: "noopener noreferrer",
          },
        }),
      ],
      content: `<div></div>`,
      editorProps: {
        attributes: {
          class: `prose prose-sm sm:prose lg:prose-sm xl:prose-sm text-sm mx-auto focus:outline-none`,
        },
      },
      onUpdate: ({ editor }) => {
        const content = editor.getHTML();
        onChange(content);
      },
    });

    function insertEmoji(emoji) {
      if (editor) {
        editor.chain().focus().insertContent(emoji.native).run();
      }
    }
    useImperativeHandle(ref, () => ({
      resetEditor: () => {
        editor.commands.clearContent();
        editor.commands.unsetAllMarks();
      },
      focusEditor: () => {
        editor.commands.focus();
      },
      insertEmoji,
      insertEditor: (comment) => {
        editor.commands.setContent(comment);
      },
    }));

    useEffect(() => {
      if (!editor) return;

      const updateSelection = () => {
        const { from, to } = editor.state.selection;
        if (from !== to) {
          const domSelection = window.getSelection();
          if (domSelection.rangeCount > 0) {
            const range = domSelection.getRangeAt(0).getBoundingClientRect();
            setSelection({ top: range.top, left: range.left });
          }
        } else {
          setSelection(null);
        }
      };
      editor.on("selectionUpdate", updateSelection);

      return () => {
        editor.off("selectionUpdate", updateSelection);
      };
    }, [editor]);

    return (
      <div className="pl-1 w-full h-full max-h-40 overflow-y-auto rounded-md">
        {selection && (
          <div className="absolute bottom-0 right-5 z-50">
            <ToolbarTextEditor editor={editor} />
          </div>
        )}
        <div
          className="w-full h-full cursor-text"
          onClick={() => editor.chain().focus().run()}
        >
          <EditorContent editor={editor} />
        </div>
        {showEmojiPicker && (
          <div
            className="absolute bottom-0 right-[100%] p-2 rounded-md shadow-lg"
            id="emoji-picker"
            style={{ overflowY: "auto", height: '300px', minHeight: '200px' }}
          >
            <Picker
              data={data}
              onEmojiSelect={insertEmoji}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        )}
      </div>
    );
  }
);

export default TextEditorInput;
