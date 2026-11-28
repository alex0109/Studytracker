"use client";

import { FC } from "react";
import { LuArrowDown } from "react-icons/lu";
import { cn } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";
import { Reveal } from "../../(home)/ui/Reveal";
import { featuredSections } from "./data";

// The three tools most learning goes through, before the full tour: each leads to its own section
export const GuideFocus: FC = () => {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="guide-focus-title" className="flex w-full max-w-6xl flex-col gap-6 px-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2
          id="guide-focus-title"
          className="text-2xl! md:text-4xl! font-semibold! tracking-tight text-neutral-900 text-balance dark:text-neutral-50"
        >
          {t("guide.focus.title")}
        </h2>
        <p className="max-w-2xl text-neutral-600 text-pretty dark:text-neutral-400">{t("guide.focus.text")}</p>
      </div>

      <ul className="grid gap-4 md:grid-cols-3">
        {featuredSections.map((section) => (
          <li key={section.id}>
            <Reveal className="h-full">
              <a
                href={`#${section.id}`}
                className="group flex h-full flex-col gap-4 rounded-[1.75rem] border border-white bg-white/80 p-6 shadow-lg shadow-neutral-900/5 backdrop-blur transition hover:-translate-y-1 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900/80"
              >
                <span className={cn("flex size-14 items-center justify-center rounded-2xl text-2xl", section.tone)}>
                  <section.icon aria-hidden />
                </span>
                <span className="flex flex-col gap-1.5">
                  <span className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
                    {t(`guide.focus.${section.id}.title`)}
                  </span>
                  <span className="text-sm text-neutral-600 text-pretty dark:text-neutral-400">
                    {t(`guide.focus.${section.id}.text`)}
                  </span>
                </span>
                <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-violet-700 dark:text-violet-300">
                  {t("guide.focus.link")}
                  <LuArrowDown aria-hidden className="transition-transform group-hover:translate-y-0.5" />
                </span>
              </a>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
};
