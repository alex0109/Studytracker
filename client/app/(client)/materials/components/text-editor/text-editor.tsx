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

import { RichTextDocument } from "@/app/types/types";
import useDebounce from "@/shared/hooks/use-debounce.hook";

interface TextEditorType {
  id: string;
  initialContent: RichTextDocument | undefined;
  updateDescriptionHandler: (id: string, description: RichTextDocument) => void;
}

const TextEditor: FC<TextEditorType> = ({
  id,
  initialContent,
  updateDescriptionHandler,
}) => {
  const [HTMLcontent, setHTMLcontent] = useState<RichTextDocument | undefined>(
    undefined,
  );

  const debouncedHTMLcontent = useDebounce(HTMLcontent, 1000);

  useEffect(() => {
    if (!debouncedHTMLcontent) return;

    if (
      JSON.stringify(initialContent) !== JSON.stringify(debouncedHTMLcontent)
    ) {
      updateDescriptionHandler(id, debouncedHTMLcontent);
    }
  }, [id, initialContent, debouncedHTMLcontent]);

  const editor = useEditor({
    extensions: [StarterKit],
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
