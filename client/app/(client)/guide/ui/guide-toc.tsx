"use client";

import { FC } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";
import { GUIDE_EXTRA_IDS, guideChapters, guideSections } from "./data";
import { useActiveSection } from "./use-active-section";

const ALL_IDS = [...guideSections.map((section) => section.id), ...GUIDE_EXTRA_IDS];

// Contents on the side of wide screens; the current part is marked while reading
export const GuideToc: FC = () => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const active = useActiveSection(ALL_IDS);

  const link = (id: string, label: string) => {
    const isActive = active === id;

    return (
      <li key={id}>
        <a
          href={`#${id}`}
          aria-current={isActive ? "location" : undefined}
          className={cn(
            "relative flex rounded-lg px-3 py-1.5 text-sm transition-colors",
            isActive
              ? "font-medium text-neutral-900 dark:text-white"
              : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white",
          )}
        >
          {isActive && (
            <motion.span
              layoutId="guide-toc-active"
              aria-hidden
              className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-neutral-800"
              transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 }}
            />
          )}
          <span className="relative">{label}</span>
        </a>
      </li>
    );
  };

  return (
    <nav aria-label={t("guide.hero.toc")} className="flex flex-col gap-4">
      {guideChapters.map((chapter) => (
        <div key={chapter} className="flex flex-col gap-1">
          <span className="px-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            {t(`guide.chapters.${chapter}`)}
          </span>
          <ul className="flex flex-col">
            {guideSections
              .filter((section) => section.chapter === chapter)
              .map((section) => link(section.id, t(`guide.sections.${section.id}.short`)))}
          </ul>
        </div>
      ))}
      <div className="flex flex-col gap-1">
        <span className="px-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
          {t("guide.chapters.more")}
        </span>
        <ul className="flex flex-col">
          {GUIDE_EXTRA_IDS.map((id) => link(id, t(`guide.${id}.short`)))}
        </ul>
      </div>
    </nav>
  );
};
