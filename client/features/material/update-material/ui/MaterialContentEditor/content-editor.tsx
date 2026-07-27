"use client";

import { FC, useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
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
  LuLink,
  LuHighlighter,
  LuImage,
} from "react-icons/lu";
import { useDebounce } from "@/shared/hooks";
import { RichTextDocument } from "@/entities/material";

interface ContentEditorType {
  id: string;
  initialContent: RichTextDocument | undefined;
  updateContentHandler: (id: string, content: RichTextDocument) => void;
}

const ContentEditor: FC<ContentEditorType> = ({
  id,
  initialContent,
  updateContentHandler,
}) => {
  const [HTMLcontent, setHTMLcontent] = useState<RichTextDocument | undefined>(
    undefined,
  );

  const debouncedHTMLcontent = useDebounce(HTMLcontent, 500);

  useEffect(() => {
    if (!debouncedHTMLcontent) return;

    if (
      JSON.stringify(initialContent) !== JSON.stringify(debouncedHTMLcontent)
    ) {
      updateContentHandler(id, debouncedHTMLcontent);
    }
  }, [id, initialContent, debouncedHTMLcontent]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false,
        underline: false,
      }),
      Highlight,
      Underline,
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const jsonContent = editor.getJSON();
      setHTMLcontent(jsonContent);
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none min-h-[250px] border-none outline-none " +
          "[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-1 " +
          "[&_a]:text-blue-600 [&_a]:underline [&_a]:cursor-pointer dark:[&_a]:text-blue-400 " +
          "[&_mark]:bg-yellow-200 [&_mark]:rounded-sm [&_mark]:px-0.5 dark:[&_mark]:bg-yellow-500/40 " +
          "[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-2",
      },
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items ?? []);
        const imageItem = items.find((item) => item.type.startsWith("image/"));

        if (!imageItem) return false;

        const file = imageItem.getAsFile();
        if (!file) return false;

        const reader = new FileReader();
        reader.onload = () => {
          const src = reader.result as string;
          const { schema } = view.state;
          const node = schema.nodes.image.create({ src });
          const transaction = view.state.tr.replaceSelectionWith(node);
          view.dispatch(transaction);
        };
        reader.readAsDataURL(file);

        return true;
      },
      handleClick: (view, pos, event) => {
        const { doc } = view.state;
        const marks = doc.resolve(pos).marks();
        const linkMark = marks.find((mark) => mark.type.name === "link");

        if (linkMark && (event.ctrlKey || event.metaKey)) {
          window.open(
            linkMark.attrs.href as string,
            "_blank",
            "noopener,noreferrer",
          );
          return true;
        }
        return false;
      },
    },
  });

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter your link", previousUrl || "https://");

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImageFromFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        editor
          .chain()
          .focus()
          .setImage({ src: reader.result as string })
          .run();
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return (
    <div className="flex flex-col w-full rounded-xl bg-neutral-200 dark:bg-neutral-900 my-2">
      <div className="w-full p-2">
        <div className="flex flex-wrap gap-1 mb-2">
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`p-2 cursor-pointer hover:opacity-50 ${
              editor.isActive("heading", { level: 1 }) ? "opacity-50" : ""
            }`}
          >
            <LuHeading1 />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`p-2 cursor-pointer hover:opacity-50 ${
              editor.isActive("heading", { level: 2 }) ? "opacity-50" : ""
            }`}
          >
            <LuHeading2 />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`p-2 cursor-pointer hover:opacity-50 ${
              editor.isActive("heading", { level: 3 }) ? "opacity-50" : ""
            }`}
          >
            <LuHeading3 />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            className={`p-2 cursor-pointer hover:opacity-50 ${
              editor.isActive("heading", { level: 4 }) ? "opacity-50" : ""
            }`}
          >
            <LuHeading4 />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 5 }).run()
            }
            className={`p-2 cursor-pointer hover:opacity-50 ${
              editor.isActive("heading", { level: 5 }) ? "opacity-50" : ""
            }`}
          >
            <LuHeading5 />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 6 }).run()
            }
            className={`p-2 cursor-pointer hover:opacity-50 ${
              editor.isActive("heading", { level: 6 }) ? "opacity-50" : ""
            }`}
          >
            <LuHeading6 />
          </button>

          <span className="w-px bg-neutral-400/50 mx-1" />

          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 cursor-pointer hover:opacity-50 ${
              editor.isActive("bold") ? "opacity-50" : ""
            }`}
          >
            <LuBold />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 cursor-pointer hover:opacity-50 ${
              editor.isActive("italic") ? "opacity-50" : ""
            }`}
          >
            <LuItalic />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 cursor-pointer hover:opacity-50 ${
              editor.isActive("underline") ? "opacity-50" : ""
            }`}
          >
            <LuUnderline />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={`p-2 cursor-pointer hover:opacity-50 ${
              editor.isActive("highlight") ? "opacity-50" : ""
            }`}
          >
            <LuHighlighter />
          </button>
          <button
            onClick={setLink}
            className={`p-2 cursor-pointer hover:opacity-50 ${
              editor.isActive("link") ? "opacity-50" : ""
            }`}
          >
            <LuLink />
          </button>

          <span className="w-px bg-neutral-400/50 mx-1" />

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 cursor-pointer hover:opacity-50 ${
              editor.isActive("bulletList") ? "opacity-50" : ""
            }`}
          >
            <LuList />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 cursor-pointer hover:opacity-50 ${
              editor.isActive("orderedList") ? "opacity-50" : ""
            }`}
          >
            <LuListOrdered />
          </button>
          <button
            onClick={addImageFromFile}
            className="p-2 cursor-pointer hover:opacity-50"
          >
            <LuImage />
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

export default ContentEditor;
