"use client";

import { FC, useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  LuBold,
  LuItalic,
  LuUnderline,
  LuListOrdered,
  LuList,
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuHeading4,
  LuHeading5,
  LuHeading6,
} from "react-icons/lu";
import Underline from "@tiptap/extension-underline";
import useMaterials from "../../hooks/useMaterials.hook";
import { RichTextDocument } from "../../services/type";
import useDebounce from "@/shared/hooks/use-debounce.hook";

const TextEditor: FC<{
  initialContent?: RichTextDocument;
  id: number;
}> = ({ initialContent, id }) => {
  const { updateMaterial } = useMaterials();

  const [HTMLcontent, setHTMLcontent] = useState<RichTextDocument | undefined>(
    undefined
  );

  const debouncedText = useDebounce(HTMLcontent, 2000);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const jsonContent = editor.getJSON();
      setHTMLcontent(jsonContent);
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none min-h-[250px] border-none outline-none",
      },
    },
  });

  useEffect(() => {
    if (debouncedText) {
      updateMaterial({ id, dataToUpdate: { description: debouncedText } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedText]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col w-full rounded-xl bg-neutral-200 dark:bg-neutral-900 my-2">
      <div className="w-full p-2">
        <div className="flex space-x-2 mb-2">
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`p-2 cursor-pointer hover:opacity-50`}
          >
            <LuHeading1 />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`p-2 cursor-pointer hover:opacity-50`}
          >
            <LuHeading2 />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`p-2 cursor-pointer hover:opacity-50`}
          >
            <LuHeading3 />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            className={`p-2 cursor-pointer hover:opacity-50`}
          >
            <LuHeading4 />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 5 }).run()
            }
            className={`p-2 cursor-pointer hover:opacity-50`}
          >
            <LuHeading5 />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 6 }).run()
            }
            className={`p-2 cursor-pointer hover:opacity-50`}
          >
            <LuHeading6 />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 cursor-pointer hover:opacity-50`}
          >
            <LuBold />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 cursor-pointer hover:opacity-50`}
          >
            <LuItalic />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 cursor-pointer hover:opacity-50`}
          >
            <LuUnderline />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 cursor-pointer hover:opacity-50`}
          >
            <LuList />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 cursor-pointer hover:opacity-50`}
          >
            <LuListOrdered />
          </button>
        </div>
        <EditorContent
          editor={editor}
          className="p-2 rounded-2xl bg-neutral-100 dark:bg-[#1c1c1c]"
        />
      </div>
    </div>
  );
};

export default TextEditor;
