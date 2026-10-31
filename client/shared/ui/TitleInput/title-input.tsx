"use client";

import { FC, useEffect, useLayoutEffect, useRef } from "react";
import { cn } from "@/shared/lib/cn";

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  ariaLabel: string;
  className?: string;
}

const fitHeight = (element: HTMLTextAreaElement | null) => {
  if (!element) return;
  element.style.height = "auto";
  element.style.height = `${element.scrollHeight}px`;
};

// Big editable title. A one-line input cut long titles off, especially on phones: this one
// wraps and grows with the text. Titles stay one line of text, so Enter finishes editing
export const TitleInput: FC<TitleInputProps> = ({
  value,
  onChange,
  maxLength,
  ariaLabel,
  className,
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => fitHeight(ref.current), [value]);

  // A narrower window wraps the same text onto more lines
  useEffect(() => {
    const onResize = () => fitHeight(ref.current);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      maxLength={maxLength}
      aria-label={ariaLabel}
      onChange={(event) => onChange(event.target.value.replace(/\s*\n\s*/g, " "))}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          event.currentTarget.blur();
        }
      }}
      className={cn(
        "block w-full resize-none overflow-hidden rounded-xl bg-transparent px-8 py-1 text-center text-2xl leading-tight font-bold text-balance outline-none transition-colors",
        "hover:bg-neutral-900/[0.03] focus:bg-white/70 focus-visible:ring-1 focus-visible:ring-neutral-200",
        "dark:hover:bg-white/[0.04] dark:focus:bg-neutral-800/60 dark:focus-visible:ring-neutral-700",
        className,
      )}
    />
  );
};
