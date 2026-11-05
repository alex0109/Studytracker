"use client";

import { FC, ReactNode, useRef } from "react";
import type { IconType } from "react-icons";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";

interface LibrarySectionProps {
  id: string;
  title: string;
  icon: IconType;
  tone: string;
  // Offers to open or close every collapsible part at once
  foldable?: boolean;
  children: ReactNode;
}

const foldButton =
  "rounded-lg px-2.5 py-1 text-sm text-neutral-500 transition-colors hover:bg-white hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100";

export const LibrarySection: FC<LibrarySectionProps> = ({ id, title, icon: Icon, tone, foldable, children }) => {
  const { t } = useTranslation();
  const section = useRef<HTMLElement>(null);

  const setAllOpen = (open: boolean) =>
    section.current?.querySelectorAll("details").forEach((details) => {
      details.open = open;
    });

  return (
    <section ref={section} id={id} className="flex scroll-mt-24 flex-col gap-4 md:scroll-mt-36 xl:scroll-mt-24">
      <header className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span aria-hidden className={cn("flex size-10 items-center justify-center rounded-xl text-lg", tone)}>
          <Icon />
        </span>
        <h2 className="font-sans text-2xl font-semibold text-neutral-900 dark:text-neutral-50">{title}</h2>
        {foldable && (
          <div className="ml-auto flex gap-1">
            <button type="button" className={foldButton} onClick={() => setAllOpen(true)}>
              {t("library.reader.expandAll")}
            </button>
            <button type="button" className={foldButton} onClick={() => setAllOpen(false)}>
              {t("library.reader.collapseAll")}
            </button>
          </div>
        )}
      </header>
      {children}
    </section>
  );
};
