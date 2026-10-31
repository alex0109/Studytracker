"use client";

import { FC, useEffect, useLayoutEffect, useRef } from "react";
import {
  useEditor,
  useEditorState,
  EditorContent,
  type Editor,
} from "@tiptap/react";
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
import { RichTextDocument } from "@/shared/types";
import { Separator } from "@/shared/radix-ui";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/cn";

// Links in notes come from users and from shared materials: only web and mail links are kept,
// so a "javascript:" link can never run on click
const SAFE_LINK = /^(https?:\/\/|mailto:)/i;
const isSafeLink = (url: string) => SAFE_LINK.test(url.trim());

const SAVE_DELAY_MS = 500;
const HEADING_LEVELS = [1, 2, 3, 4, 5, 6] as const;

interface ContentEditorType {
  materailId: string;
  noteId?: string;
  initialContent: RichTextDocument | undefined;
  updateContentHandler: (
    materailId: string,
    content: RichTextDocument,
    noteId?: string,
  ) => void;
}

const ContentEditor: FC<ContentEditorType> = ({
  materailId,
  initialContent,
  noteId,
  updateContentHandler,
}) => {
  const { t } = useTranslation();

  // Autosave without a re-render per keystroke: the document becomes JSON only once typing
  // pauses. It is compared with what was last sent, not with the server's answer, which
  // spells the same text differently (null fields): that made every pause save twice
  const latest = useRef({ materailId, noteId, updateContentHandler });
  useLayoutEffect(() => {
    latest.current = { materailId, noteId, updateContentHandler };
  });
  const lastSent = useRef<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = (current: Editor) => {
    saveTimer.current = null;
    const json = current.getJSON() as RichTextDocument;
    const text = JSON.stringify(json);
    if (text === lastSent.current) return;

    lastSent.current = text;
    const { materailId, noteId, updateContentHandler } = latest.current;
    updateContentHandler(materailId, json, noteId);
  };

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
        isAllowedUri: (url) => isSafeLink(url),
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
    // The loaded text as the editor spells it: opening a note is not an edit to save.
    // An empty transaction first lets plugins settle the document (the trailing paragraph after a
    // list or a heading), otherwise they do it on the first click or selection and that gets saved
    onCreate: ({ editor }) => {
      editor.view.dispatch(editor.state.tr.setMeta("addToHistory", false));
      lastSent.current = JSON.stringify(editor.getJSON());
    },
    onUpdate: ({ editor }) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => save(editor), SAVE_DELAY_MS);
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl dark:prose-invert focus:outline-none min-h-[250px] border-none outline-none " +
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

        if (
          linkMark &&
          (event.ctrlKey || event.metaKey) &&
          isSafeLink(String(linkMark.attrs.href ?? ""))
        ) {
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

  // Toolbar buttons follow the cursor too, not only typing, and re-render only when one flips
  const active = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      headings: HEADING_LEVELS.map(
        (level) => current?.isActive("heading", { level }) ?? false,
      ),
      bold: current?.isActive("bold") ?? false,
      italic: current?.isActive("italic") ?? false,
      underline: current?.isActive("underline") ?? false,
      highlight: current?.isActive("highlight") ?? false,
      link: current?.isActive("link") ?? false,
      bulletList: current?.isActive("bulletList") ?? false,
      orderedList: current?.isActive("orderedList") ?? false,
    }),
  });

  // Opening something else right after typing still saves the last words
  useEffect(() => {
    if (!editor) return;
    return () => {
      if (!saveTimer.current) return;
      clearTimeout(saveTimer.current);
      try {
        save(editor);
      } catch {
        // The editor is already gone: nothing left to read
      }
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const input = window.prompt(t("editor.linkPrompt"), previousUrl || "https://");

    if (input === null) return;

    const url = input.trim();
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // "example.com" becomes https://example.com, other schemes are refused
    const href = /^[a-z][a-z0-9+.-]*:/i.test(url) ? url : `https://${url}`;
    if (!isSafeLink(href)) {
      window.alert(t("editor.linkInvalid"));
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
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

  const headingIcons = [LuHeading1, LuHeading2, LuHeading3, LuHeading4, LuHeading5, LuHeading6];

  const tools = [
    ...headingIcons.map((Icon, index) => {
      const level = (index + 1) as 1 | 2 | 3 | 4 | 5 | 6;
      return {
        key: `h${level}`,
        icon: Icon,
        label: t("editor.heading", { level }),
        active: active?.headings[index] ?? false,
        run: () => editor.chain().focus().toggleHeading({ level }).run(),
        separatorAfter: level === 6,
      };
    }),
    { key: "bold", icon: LuBold, label: t("editor.bold"), active: active?.bold ?? false, run: () => editor.chain().focus().toggleBold().run() },
    { key: "italic", icon: LuItalic, label: t("editor.italic"), active: active?.italic ?? false, run: () => editor.chain().focus().toggleItalic().run() },
    { key: "underline", icon: LuUnderline, label: t("editor.underline"), active: active?.underline ?? false, run: () => editor.chain().focus().toggleUnderline().run() },
    { key: "highlight", icon: LuHighlighter, label: t("editor.highlight"), active: active?.highlight ?? false, run: () => editor.chain().focus().toggleHighlight().run() },
    { key: "link", icon: LuLink, label: t("editor.link"), active: active?.link ?? false, run: setLink, separatorAfter: true },
    { key: "bullets", icon: LuList, label: t("editor.bulletList"), active: active?.bulletList ?? false, run: () => editor.chain().focus().toggleBulletList().run() },
    { key: "numbers", icon: LuListOrdered, label: t("editor.orderedList"), active: active?.orderedList ?? false, run: () => editor.chain().focus().toggleOrderedList().run() },
    { key: "image", icon: LuImage, label: t("editor.image"), active: false, run: addImageFromFile },
  ];

  return (
    <div className="flex flex-col w-full rounded-xl my-2">
      <div className="w-full p-2">
        <div
          role="toolbar"
          aria-label={t("editor.toolbar")}
          className="flex flex-wrap gap-1 mb-2 bg-neutral-200 rounded-xl p-2 dark:bg-neutral-800"
        >
          {tools.map((tool) => (
            <span key={tool.key} className="contents">
              <button
                type="button"
                onClick={tool.run}
                title={tool.label}
                aria-label={tool.label}
                aria-pressed={tool.active}
                className={cn(
                  "p-2 cursor-pointer rounded-lg text-neutral-800 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-neutral-700",
                  tool.active && "bg-neutral-300 dark:bg-neutral-700",
                )}
              >
                <tool.icon />
              </button>
              {"separatorAfter" in tool && tool.separatorAfter && (
                <span className="w-px bg-neutral-400/50 mx-1" />
              )}
            </span>
          ))}
        </div>
        <EditorContent
          editor={editor}
          className="p-2 rounded-2xl bg-neutral-100 break-words min-w-0 dark:bg-neutral-800/60 dark:text-neutral-100"
        />
      </div>
      <Separator />
    </div>
  );
};

export default ContentEditor;
