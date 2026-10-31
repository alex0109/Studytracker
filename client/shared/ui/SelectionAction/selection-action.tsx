"use client";

import { FC, ReactNode, RefObject, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMediaQuery } from "@/shared/hooks/use-media-query";
import { sentenceOfRange, wordCount } from "@/shared/lib/text-selection";

export interface TextSelectionInfo {
  text: string;
  sentence: string;
  rect: DOMRect;
  // A copy, so the place can be marked after the selection is gone
  range: Range;
}

interface SelectionActionProps {
  containerRef: RefObject<HTMLElement | null>;
  label: string;
  icon?: ReactNode;
  maxWords?: number;
  // Hidden while the caller shows its own panel for the picked text
  hidden?: boolean;
  onPick: (selection: TextSelectionInfo) => void;
}

const MAX_LENGTH = 100;
const BUTTON_HEIGHT = 36;

// A small button next to a selection of a few words inside the container. It only reads the
// selection, so it works on the editor and on read-only text alike and never edits anything
export const SelectionAction: FC<SelectionActionProps> = ({
  containerRef,
  label,
  icon,
  maxWords = 6,
  hidden = false,
  onPick,
}) => {
  // Phones show their own copy menu above a selection, so the button goes below it
  const touch = useMediaQuery("(pointer: coarse)");
  const [selection, setSelection] = useState<TextSelectionInfo | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const read = () => {
      const container = containerRef.current;
      const current = window.getSelection();
      if (!container || !current || current.rangeCount === 0 || current.isCollapsed) {
        setSelection(null);
        return;
      }

      const range = current.getRangeAt(0);
      const text = range.toString().replace(/\s+/g, " ").trim();
      const inside = container.contains(range.commonAncestorContainer);
      if (!inside || !text || text.length > MAX_LENGTH || wordCount(text) > maxWords) {
        setSelection(null);
        return;
      }

      setSelection({
        text,
        sentence: sentenceOfRange(range, container),
        rect: range.getBoundingClientRect(),
        range: range.cloneRange(),
      });
    };

    // Selections change on every handle move: read once the hand stops
    const onChange = () => {
      clearTimeout(timer);
      timer = setTimeout(read, 180);
    };
    const onScroll = () => setSelection(null);

    document.addEventListener("selectionchange", onChange);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("selectionchange", onChange);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [containerRef, maxWords]);

  const visible = !!selection && !hidden;
  const top = selection
    ? touch
      ? selection.rect.bottom + 12
      : Math.max(8, selection.rect.top - BUTTON_HEIGHT - 8)
    : 0;
  const left = selection
    ? Math.min(Math.max(selection.rect.left + selection.rect.width / 2, 80), window.innerWidth - 80)
    : 0;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="selection-action"
          type="button"
          initial={{ opacity: 0, y: 4, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          style={{ top, left }}
          // Keeps the selection: a mouse down elsewhere would clear it before the click
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            if (selection) onPick(selection);
            setSelection(null);
          }}
          className="fixed z-50 flex h-9 -translate-x-1/2 items-center gap-1.5 rounded-full bg-neutral-900 px-3.5 text-sm font-medium whitespace-nowrap text-white shadow-lg hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          {icon}
          {label}
        </motion.button>
      )}
    </AnimatePresence>
  );
};
