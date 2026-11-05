"use client";

import { FC, ReactNode, SyntheticEvent } from "react";
import { LuChevronDown } from "react-icons/lu";
import { cn } from "@/shared/lib";
import styles from "./library-reader.module.css";

// The bottom edge of the fixed navigation: a header above it can't be seen
const NAV_BOTTOM = 80;

// Native details, not the Accordion from shared/ui: the text stays in the first HTML for search
// engines, and the browser's find in page opens the section that holds the match.
// A summary may only hold a heading and inline elements, so what's passed in is laid out by the row here
export const LibraryDisclosure: FC<{ id: string; summary: ReactNode; children: ReactNode }> = ({ id, summary, children }) => {
  // Closing a long section from its stuck header would leave the reader far below it
  const keepInView = ({ currentTarget }: SyntheticEvent<HTMLDetailsElement>) => {
    if (!currentTarget.open && currentTarget.getBoundingClientRect().top < NAV_BOTTOM) currentTarget.scrollIntoView();
  };

  return (
    <details
      id={id}
      onToggle={keepInView}
      className={cn(
        styles.Disclosure,
        // Between md and xl the language and theme buttons float under the navigation: headers stop below them
        "group scroll-mt-24 rounded-2xl border border-neutral-200 bg-white shadow-xs md:scroll-mt-36 xl:scroll-mt-24 dark:border-neutral-800 dark:bg-neutral-900",
      )}
    >
      <summary className="sticky top-20 z-10 flex md:top-32 xl:top-20 cursor-pointer list-none items-center gap-3 rounded-2xl bg-white px-4 py-3.5 transition-colors hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-emerald-500 group-open:rounded-b-none group-open:border-b group-open:border-neutral-100 sm:px-5 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:group-open:border-neutral-800 [&::-webkit-details-marker]:hidden">
        {summary}
        <LuChevronDown
          aria-hidden
          className="ml-auto shrink-0 text-neutral-400 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
        />
      </summary>
      <div className="p-4 sm:p-5">{children}</div>
    </details>
  );
};
