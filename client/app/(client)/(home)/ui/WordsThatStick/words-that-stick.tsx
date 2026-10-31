"use client";

import { FC } from "react";
import { useTranslation } from "@/shared/i18n";
import { LuArrowDown, LuArrowLeft, LuArrowRight } from "react-icons/lu";
import { cn } from "@/shared/lib";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { FlashcardsDemo } from "./flashcards-demo";

const RULES = [
  {
    icon: LuArrowLeft,
    key: "dontKnow",
    styles: "bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400",
  },
  {
    icon: LuArrowDown,
    key: "unsure",
    styles: "bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
  },
  {
    icon: LuArrowRight,
    key: "know",
    styles: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400",
  },
] as const;

export const WordsThatStick: FC = () => {
  const { t } = useTranslation();

  return (
    <section className="grid w-full max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
      <Reveal className="flex flex-col gap-8">
        <SectionHeading
          align="left"
          eyebrow={t("landing.words.eyebrow")}
          title={t("landing.words.title")}
          text={t("landing.words.text")}
        />
        <ul className="flex flex-col gap-3">
          {RULES.map((rule) => (
            <li
              key={rule.key}
              className="flex items-center gap-3 rounded-2xl border border-white bg-white/70 p-3 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/70"
            >
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl",
                  rule.styles,
                )}
              >
                <rule.icon />
              </span>
              <span className="text-neutral-700 dark:text-neutral-300">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {t(`flashcards.answers.${rule.key}`)}
                </span>{" "}
                {t(`landing.words.rules.${rule.key}`)}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {t("landing.words.fsrs")}
        </p>
      </Reveal>

      <Reveal>
        <FlashcardsDemo />
      </Reveal>
    </section>
  );
};
