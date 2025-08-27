"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  LuBold,
  LuItalic,
  LuUnderline,
  LuListOrdered,
  LuList,
  LuHeading,
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuHeading4,
  LuHeading5,
  LuHeading6,
} from "react-icons/lu";
import Underline from "@tiptap/extension-underline";
import CustomButton from "./button";

const TextEditor = () => {
  const [headingLevel, setHeadingLevel] = useState(1);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: "<p>Hello World! 🌎️</p>",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none min-h-[250px] border-none outline-none",
      },
    },
  });

  if (!editor) {
    return null;
  }

  const saveContent = () => {
    if (editor) {
      console.log(editor.getJSON());
    }
  };

  return (
    <div className="flex flex-col w-full rounded-xl bg-neutral-900 my-2">
      <div className="w-full p-2">
        <div className="flex space-x-2 mb-2">
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`p-2 cursor-pointer hover:opacity-50 ${
              editor.isActive("bold") ? "bg-gray-300" : ""
            }`}
          >
            <LuHeading1 />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`p-2 cursor-pointer hover:opacity-50 ${
              editor.isActive("bold") ? "bg-gray-300" : ""
            }`}
          >
            <LuHeading2 />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`p-2 cursor-pointer hover:opacity-50 ${
              editor.isActive("bold") ? "bg-gray-300" : ""
            }`}
          >
            <LuHeading3 />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            className={`p-2 cursor-pointer hover:opacity-50 ${
              editor.isActive("bold") ? "bg-gray-300" : ""
            }`}
          >
            <LuHeading4 />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 5 }).run()
            }
            className={`p-2 cursor-pointer hover:opacity-50 ${
              editor.isActive("bold") ? "bg-gray-300" : ""
            }`}
          >
            <LuHeading5 />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 6 }).run()
            }
            className={`p-2 cursor-pointer hover:opacity-50 ${
              editor.isActive("bold") ? "bg-gray-300" : ""
            }`}
          >
            <LuHeading6 />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 cursor-pointer hover:opacity-50 ${
              editor.isActive("bold") ? "bg-gray-300" : ""
            }`}
          >
            <LuBold />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 cursor-pointer hover:opacity-50 ${
              editor.isActive("italic") ? "bg-gray-300" : ""
            }`}
          >
            <LuItalic />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 cursor-pointer hover:opacity-50 ${
              editor.isActive("underline") ? "bg-gray-300" : ""
            }`}
          >
            <LuUnderline />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 cursor-pointer hover:opacity-50 ${
              editor.isActive("bulletList") ? "bg-gray-300" : ""
            }`}
          >
            <LuList />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 cursor-pointer hover:opacity-50 ${
              editor.isActive("orderedList") ? "bg-gray-300" : ""
            }`}
          >
            <LuListOrdered />
          </button>
        </div>
        <EditorContent editor={editor} className="p-2 bg-[#1c1c1c]" />
        <div className="w-[100px] my-5">
          <CustomButton title="Save" onClick={saveContent} />
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
