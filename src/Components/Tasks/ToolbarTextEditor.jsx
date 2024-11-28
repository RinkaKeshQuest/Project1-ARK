import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBold,
  faItalic,
  faUnderline,
  faStrikethrough,
  faCode,
  faParagraph,
  faHeading,
  faListOl,
  faListUl,
  faQuoteRight,
  faCodeBranch,
  faRulerHorizontal,
  faRedo,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
const ToolbarTextEditor = ({ editor }) => {
  if (!editor || !editor.isEditable) {
    return null;
  }

  const items = [
    {
      icon: faBold,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
    },
    {
      icon: faItalic,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
    },
    {
      icon: faUnderline,
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive("underline"),
    },
    {
      icon: faStrikethrough,
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive("strike"),
    },
    {
      icon: faCode,
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive("code"),
    },
    {
      icon: faListUl,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
    },
    {
      icon: faListOl,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
    },
    {
      icon: faParagraph,
      action: () => editor.chain().focus().setParagraph().run(),
      isActive: editor.isActive("paragraph"),
    },
    {
      icon: faHeading,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive("heading", { level: 1 }),
    },
    {
      icon: faQuoteRight,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive("blockquote"),
    },
    {
      icon: faRulerHorizontal,
      action: () => editor.chain().focus().setHorizontalRule().run(),
      isActive: false,
    },
    {
      icon: faUndo,
      action: () => editor.chain().focus().undo().run(),
      isActive: false,
    },
    {
      icon: faRedo,
      action: () => editor.chain().focus().redo().run(),
      isActive: false,
    },
    {
      icon: faCodeBranch,
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: editor.isActive("codeBlock"),
    },
  ];

  return (
    <div className="bg-gray-100 border rounded shadow-lg flex space-x-2 p-2">
      {items.map((item, index) => (
        <div
          key={index}
          className={`px-2 py-1 ${
            item.isActive ? "bg-blue-500 text-white" : ""
          }`}
          onClick={item.action}
        >
          <FontAwesomeIcon icon={item.icon} />
        </div>
      ))}
    </div>
  );
};

export default ToolbarTextEditor;
