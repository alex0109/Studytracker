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
  LuCheck,
  LuChevronDown,
  LuCode,
  LuItalic,
  LuUnderline,
  LuListOrdered,
  LuList,
  LuLink,
  LuHighlighter,
  LuImage,
  LuQuote,
  LuRedo2,
  LuStrikethrough,
  LuUndo2,
} from "react-icons/lu";
import type { IconType } from "react-icons";
import { RichTextDocument } from "@/shared/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/radix-ui";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/cn";

// Links in notes come from users and from shared materials: only web and mail links are kept,
// so a "javascript:" link can never run on click
const SAFE_LINK = /^(https?:\/\/|mailto:)/i;
const isSafeLink = (url: string) => SAFE_LINK.test(url.trim());

const SAVE_DELAY_MS = 500;
const HEADING_LEVELS = [1, 2, 3, 4, 5, 6] as const;
// The menu offers three levels; deeper ones from older notes still show and are named
const MENU_LEVELS = [1, 2, 3] as const;

interface Tool {
  key: string;
  icon: IconType;
  label: string;
  // Shown in the tooltip, with the platform's modifier key
  keys?: string;
  active?: boolean;
  disabled?: boolean;
  run: () => void;
}

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
          // One comfortable reading size: prose-2xl on wide screens made notes look like posters
          "prose prose-neutral sm:prose-base max-w-none dark:prose-invert focus:outline-none min-h-[280px] border-none outline-none " +
          "px-5 py-5 sm:px-8 sm:py-6 leading-relaxed [&_p]:my-2 [&_h1]:mt-6 [&_h2]:mt-5 [&_h3]:mt-4 [&_h1:first-child]:mt-0 " +
          "[&_blockquote]:border-l-4 [&_blockquote]:border-neutral-300 [&_blockquote]:pl-4 [&_blockquote]:not-italic dark:[&_blockquote]:border-neutral-600 " +
          "[&_code]:rounded [&_code]:bg-neutral-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:before:content-none [&_code]:after:content-none dark:[&_code]:bg-neutral-800 " +
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
      strike: current?.isActive("strike") ?? false,
      blockquote: current?.isActive("blockquote") ?? false,
      code: current?.isActive("code") ?? false,
      canUndo: current?.can().undo() ?? false,
      canRedo: current?.can().redo() ?? false,
      isEmpty: current?.isEmpty ?? true,
      words: current?.state.doc.textContent.split(/\s+/).filter(Boolean).length ?? 0,
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

  const mod = /Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘" : "Ctrl";
  const level = active?.headings.findIndex(Boolean) ?? -1;
  const styleLabel = level >= 0 ? t("editor.heading", { level: level + 1 }) : t("editor.paragraph");

  // Grouped by what they change: history, letters, blocks, inserts
  const groups: Tool[][] = [
    [
      { key: "undo", icon: LuUndo2, label: t("editor.undo"), keys: `${mod}+Z`, disabled: !active?.canUndo, run: () => editor.chain().focus().undo().run() },
      { key: "redo", icon: LuRedo2, label: t("editor.redo"), keys: `${mod}+Shift+Z`, disabled: !active?.canRedo, run: () => editor.chain().focus().redo().run() },
    ],
    [
      { key: "bold", icon: LuBold, label: t("editor.bold"), keys: `${mod}+B`, active: active?.bold, run: () => editor.chain().focus().toggleBold().run() },
      { key: "italic", icon: LuItalic, label: t("editor.italic"), keys: `${mod}+I`, active: active?.italic, run: () => editor.chain().focus().toggleItalic().run() },
      { key: "underline", icon: LuUnderline, label: t("editor.underline"), keys: `${mod}+U`, active: active?.underline, run: () => editor.chain().focus().toggleUnderline().run() },
      { key: "strike", icon: LuStrikethrough, label: t("editor.strike"), keys: `${mod}+Shift+S`, active: active?.strike, run: () => editor.chain().focus().toggleStrike().run() },
      { key: "highlight", icon: LuHighlighter, label: t("editor.highlight"), keys: `${mod}+Shift+H`, active: active?.highlight, run: () => editor.chain().focus().toggleHighlight().run() },
    ],
    [
      { key: "bullets", icon: LuList, label: t("editor.bulletList"), keys: `${mod}+Shift+8`, active: active?.bulletList, run: () => editor.chain().focus().toggleBulletList().run() },
      { key: "numbers", icon: LuListOrdered, label: t("editor.orderedList"), keys: `${mod}+Shift+7`, active: active?.orderedList, run: () => editor.chain().focus().toggleOrderedList().run() },
      { key: "quote", icon: LuQuote, label: t("editor.quote"), keys: `${mod}+Shift+B`, active: active?.blockquote, run: () => editor.chain().focus().toggleBlockquote().run() },
      { key: "code", icon: LuCode, label: t("editor.code"), keys: `${mod}+E`, active: active?.code, run: () => editor.chain().focus().toggleCode().run() },
    ],
    [
      { key: "link", icon: LuLink, label: t("editor.link"), active: active?.link, run: setLink },
      { key: "image", icon: LuImage, label: t("editor.image"), run: addImageFromFile },
    ],
  ];

  const toolButton = (tool: Tool) => (
    <button
      key={tool.key}
      type="button"
      onClick={tool.run}
      disabled={tool.disabled}
      title={tool.keys ? `${tool.label} (${tool.keys})` : tool.label}
      aria-label={tool.label}
      aria-pressed={tool.active === undefined ? undefined : tool.active}
      className={cn(
        "flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-neutral-600 transition",
        "hover:bg-neutral-100 hover:text-neutral-900 disabled:cursor-default disabled:opacity-35 disabled:hover:bg-transparent",
        "dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white",
        tool.active && "bg-neutral-900 text-white hover:bg-neutral-800 hover:text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 dark:hover:text-neutral-900",
      )}
    >
      <tool.icon className="size-4" />
    </button>
  );

  const divider = <span aria-hidden className="mx-1 h-5 w-px shrink-0 bg-neutral-200 dark:bg-neutral-700" />;

  return (
    // One card: the toolbar stays under the menu bar while a long note scrolls
    <div className="my-2 flex w-full min-w-0 flex-col rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div
        role="toolbar"
        aria-label={t("editor.toolbar")}
        className="sticky top-[4.75rem] z-10 flex items-center gap-0.5 overflow-x-auto rounded-t-2xl border-b border-neutral-200 bg-white/95 px-2 py-1.5 backdrop-blur md:top-28 dark:border-neutral-800 dark:bg-neutral-900/95"
      >
        {groups[0].map(toolButton)}
        {divider}
        <DropdownMenu>
          <DropdownMenuTrigger
            title={t("editor.textStyle")}
            className="flex h-8 shrink-0 items-center gap-1 rounded-lg px-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            <span className="whitespace-nowrap">{styleLabel}</span>
            <LuChevronDown aria-hidden className="size-3.5 opacity-60" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-44">
            <DropdownMenuItem onSelect={() => editor.chain().focus().setParagraph().run()}>
              {t("editor.paragraph")}
              {level < 0 && <LuCheck aria-hidden className="ml-auto" />}
            </DropdownMenuItem>
            {MENU_LEVELS.map((menuLevel) => (
              <DropdownMenuItem
                key={menuLevel}
                onSelect={() => editor.chain().focus().toggleHeading({ level: menuLevel }).run()}
                className={cn(
                  "font-semibold",
                  menuLevel === 1 ? "text-lg" : menuLevel === 2 ? "text-base" : "text-sm",
                )}
              >
                {t("editor.heading", { level: menuLevel })}
                {level === menuLevel - 1 && <LuCheck aria-hidden className="ml-auto" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {divider}
        {groups[1].map(toolButton)}
        {divider}
        {groups[2].map(toolButton)}
        {divider}
        {groups[3].map(toolButton)}
      </div>

      <div className="relative">
        {/* Not an extension: the empty state is already known from the editor */}
        {active?.isEmpty && (
          <p
            aria-hidden
            className="pointer-events-none absolute top-5 left-5 text-neutral-400 sm:top-6 sm:left-8 sm:text-base dark:text-neutral-500"
          >
            {t("editor.placeholder")}
          </p>
        )}
        <EditorContent editor={editor} className="min-w-0 break-words text-neutral-900 dark:text-neutral-100" />
      </div>

      <div className="flex items-center justify-end gap-3 rounded-b-2xl border-t border-neutral-100 px-4 py-2 text-xs text-neutral-400 dark:border-neutral-800">
        <span className="tabular-nums">{t("editor.words", { count: active?.words ?? 0 })}</span>
      </div>
    </div>
  );
};

export default ContentEditor;
