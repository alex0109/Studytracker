// SHARED-UI
"use client";

import { FC, useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/radix-ui/Tooltip/tooltip";
import { cn } from "@/shared/lib/cn";

interface TruncatedTextProps {
  text: string;
  // One line ends with "…", two lines wrap first and then end with "…"
  lines?: 1 | 2;
  className?: string;
}

const isCut = (element: HTMLElement | null) =>
  !!element &&
  (element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1);

// The whole text appears in a tooltip on hover, but only when it was actually cut:
// a short title doesn't need a tooltip repeating it
export const TruncatedText: FC<TruncatedTextProps> = ({ text, lines = 1, className }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <Tooltip delayDuration={300} open={open} onOpenChange={(next) => setOpen(next && isCut(ref.current))}>
      <TooltipTrigger asChild>
        <span
          ref={ref}
          className={cn("min-w-0", lines === 1 ? "truncate" : "line-clamp-2 break-words", className)}
        >
          {text}
        </span>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={10} className="max-w-xs text-left text-sm break-words">
        {text}
      </TooltipContent>
    </Tooltip>
  );
};
