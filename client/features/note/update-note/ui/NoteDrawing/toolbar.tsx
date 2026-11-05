"use client";

import React, { FC } from "react";
import { useTranslation } from "@/shared/i18n";
import { LuEraser, LuHighlighter, LuPen, LuRedo2, LuTrash2, LuUndo2 } from "react-icons/lu";
import { SaveStatus } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { ITool } from "../../model/tool";
import { BRUSH_SIZES, MARKER_COLORS, PEN_COLORS } from "../../consts";

interface ToolbarProps {
  tool: ITool;
  color: string;
  size: number;
  canUndo: boolean;
  canRedo: boolean;
  canClear: boolean;
  isSaving: boolean;
  isSaveError: boolean;
  onToolChange: (tool: ITool) => void;
  onColorChange: (color: string) => void;
  onSizeChange: (size: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
}

const TOOLS: { value: ITool; icon: typeof LuPen; shortcut: string }[] = [
  { value: "pen", icon: LuPen, shortcut: "P" },
  { value: "highlighter", icon: LuHighlighter, shortcut: "H" },
  { value: "eraser", icon: LuEraser, shortcut: "E" },
];

const iconButton =
  "flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 disabled:cursor-default disabled:opacity-35 disabled:hover:bg-transparent dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white";

const Divider = () => <span aria-hidden className="mx-1 h-6 w-px shrink-0 bg-neutral-200 dark:bg-neutral-700" />;

export const Toolbar: FC<ToolbarProps> = ({
  tool,
  color,
  size,
  canUndo,
  canRedo,
  canClear,
  isSaving,
  isSaveError,
  onToolChange,
  onColorChange,
  onSizeChange,
  onUndo,
  onRedo,
  onClear,
}) => {
  const { t } = useTranslation();
  const mod = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘" : "Ctrl";
  const palette = tool === "highlighter" ? MARKER_COLORS : PEN_COLORS;
  const isCustomColor = !palette.includes(color);

  return (
    // Stays under the menu bar while a tall drawing scrolls
    <div
      role="toolbar"
      aria-label={t("notes.drawing.toolbar")}
      className="sticky top-[4.75rem] z-10 flex items-center gap-1 overflow-x-auto [scrollbar-width:none] rounded-2xl border border-neutral-200 bg-white/95 p-1.5 shadow-sm backdrop-blur md:top-28 dark:border-neutral-800 dark:bg-neutral-900/95"
    >
      {TOOLS.map(({ value, icon: Icon, shortcut }) => (
        <button
          key={value}
          type="button"
          onClick={() => onToolChange(value)}
          title={`${t(`notes.drawing.tools.${value}`)} (${shortcut})`}
          aria-label={t(`notes.drawing.tools.${value}`)}
          aria-pressed={tool === value}
          className={cn(
            iconButton,
            tool === value &&
              "bg-neutral-900 text-white hover:bg-neutral-800 hover:text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 dark:hover:text-neutral-900",
          )}
        >
          <Icon aria-hidden className="size-[1.1rem]" />
        </button>
      ))}

      <Divider />

      {/* An eraser has no colour, so this group is only for what paints */}
      {tool !== "eraser" && (
        <>
          <div role="group" aria-label={t("notes.drawing.color")} className="flex shrink-0 items-center gap-1 px-0.5">
            {palette.map((swatch) => (
              <button
                key={swatch}
                type="button"
                onClick={() => onColorChange(swatch)}
                aria-label={swatch}
                aria-pressed={color === swatch}
                style={{ backgroundColor: swatch }}
                className={cn(
                  "size-6 shrink-0 cursor-pointer rounded-full border border-black/10 transition-transform hover:scale-110 motion-reduce:transition-none",
                  color === swatch && "ring-2 ring-neutral-900 ring-offset-2 ring-offset-white dark:ring-white dark:ring-offset-neutral-900",
                )}
              />
            ))}
            <label
              title={t("notes.drawing.customColor")}
              className={cn(
                "relative size-6 shrink-0 cursor-pointer overflow-hidden rounded-full border border-black/10 transition-transform hover:scale-110 motion-reduce:transition-none",
                isCustomColor && "ring-2 ring-neutral-900 ring-offset-2 ring-offset-white dark:ring-white dark:ring-offset-neutral-900",
              )}
              style={{
                background: isCustomColor
                  ? color
                  : "conic-gradient(#ef4444, #f59e0b, #22c55e, #3b82f6, #a855f7, #ef4444)",
              }}
            >
              <input
                type="color"
                value={color}
                onChange={(event) => onColorChange(event.target.value)}
                aria-label={t("notes.drawing.customColor")}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </label>
          </div>
          <Divider />
        </>
      )}

      <div role="group" aria-label={t("notes.drawing.size")} className="flex shrink-0 items-center gap-0.5">
        {BRUSH_SIZES.map((brush) => (
          <button
            key={brush}
            type="button"
            onClick={() => onSizeChange(brush)}
            aria-label={`${t("notes.drawing.size")}: ${brush}`}
            aria-pressed={size === brush}
            className={cn(iconButton, "size-8", size === brush && "bg-neutral-100 dark:bg-neutral-800")}
          >
            <span
              aria-hidden
              className="rounded-full bg-current"
              style={{ width: 3 + BRUSH_SIZES.indexOf(brush) * 3, height: 3 + BRUSH_SIZES.indexOf(brush) * 3 }}
            />
          </button>
        ))}
      </div>

      <Divider />

      <button
        type="button"
        onClick={onUndo}
        disabled={!canUndo}
        title={`${t("notes.drawing.undo")} (${mod}+Z)`}
        aria-label={t("notes.drawing.undo")}
        className={iconButton}
      >
        <LuUndo2 aria-hidden className="size-[1.1rem]" />
      </button>
      <button
        type="button"
        onClick={onRedo}
        disabled={!canRedo}
        title={`${t("notes.drawing.redo")} (${mod}+Shift+Z)`}
        aria-label={t("notes.drawing.redo")}
        className={iconButton}
      >
        <LuRedo2 aria-hidden className="size-[1.1rem]" />
      </button>
      {/* No confirmation: clearing can be undone like any stroke */}
      <button
        type="button"
        onClick={onClear}
        disabled={!canClear}
        title={t("notes.drawing.clear")}
        aria-label={t("notes.drawing.clear")}
        className={iconButton}
      >
        <LuTrash2 aria-hidden className="size-[1.1rem]" />
      </button>

      <div className="ml-auto flex shrink-0 items-center pr-2 pl-1">
        <SaveStatus isPending={isSaving} isError={isSaveError} />
      </div>
    </div>
  );
};
