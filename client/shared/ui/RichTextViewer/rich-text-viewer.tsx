"use client";

import { FC } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import { RichTextDocument } from "@/shared/types";
import { cn } from "@/shared/lib/cn";
import { readingClasses } from "./reading-classes";

// Same rule as the editor: other people's text keeps only web and mail links
const SAFE_LINK = /^(https?:\/\/|mailto:)/i;

interface RichTextViewerProps {
  content: RichTextDocument;
  className?: string;
}

// Shows editor content without any way to change it
const RichTextViewer: FC<RichTextViewerProps> = ({ content, className }) => {
  const editor = useEditor({
    editable: false,
    immediatelyRender: false,
    content,
    extensions: [
      StarterKit.configure({ link: false, underline: false }),
      Highlight,
      Underline,
      Link.configure({
        openOnClick: true,
        isAllowedUri: (url) => SAFE_LINK.test(url.trim()),
        HTMLAttributes: { rel: "noopener noreferrer nofollow", target: "_blank" },
      }),
      Image.configure({ inline: true, allowBase64: true }),
    ],
    editorProps: {
      attributes: { class: cn("outline-none", readingClasses, className) },
    },
  });

  return <EditorContent editor={editor} />;
};

export default RichTextViewer;
