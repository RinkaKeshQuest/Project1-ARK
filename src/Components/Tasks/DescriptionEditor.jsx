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
const DescriptionEditor = forwardRef(({ onChange, value, focus }, ref) => {
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
            style: "white-space: normal; word-break: break-word; overflow-wrap: break-word;",
          },
        },
      }),
      BulletList,
      OrderedList,
      ListItem,
      Underline,
    ],
    content: value || `<div></div>`,
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose lg:prose-sm xl:prose-sm text-sm  focus:outline-none pl-0 m-0`,
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      onChange({ target: { value: content } });
    },
  });
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  useImperativeHandle(ref, () => ({
    resetEditor: () => {
      editor.commands.clearContent();
      editor.commands.unsetAllMarks();
    },
    focusEditor: () => {
      editor.commands.focus();
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
    <div className="pl-1 lg:pl-0 w-full h-full overflow-y-auto">
      {selection && (
        <div className="absolute -bottom-12 left-5 z-50">
          <ToolbarTextEditor editor={editor} />
        </div>
      )}
      <div
        className="w-full h-full cursor-text lg:pl-0"
        onClick={() => editor.chain().focus().run()}
      >
        <EditorContent editor={editor} style={{ overflowX: "auto", width: "100%", whiteSpace:"normal", overflowWrap: "break-word" }}/>
      </div>
    </div>
  );
});

export default DescriptionEditor;
