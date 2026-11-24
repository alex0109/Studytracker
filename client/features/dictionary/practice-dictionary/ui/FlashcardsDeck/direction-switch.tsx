"use client";

import { FC } from "react";
import { cn } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";
import { CardDirection } from "../../lib/card-direction";

const OPTIONS: CardDirection[] = ["term", "translation", "mixed"];

// "First show": the word, the translation, or mixed
export const DirectionSwitch: FC<{ value: CardDirection; onChange: (value: CardDirection) => void }> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <div className="flex w-full max-w-[460px] flex-wrap items-center justify-center gap-2">
      <span className="text-sm text-neutral-500">{t("flashcards.direction.label")}</span>
      <div role="radiogroup" aria-label={t("flashcards.direction.label")} className="flex rounded-full bg-neutral-100 p-1 dark:bg-neutral-800">
        {OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={value === option}
            onClick={() => onChange(option)}
            className={cn(
              "min-h-11 rounded-full px-4 text-base font-medium transition sm:min-h-9 sm:px-3.5 sm:text-sm",
              value === option
                ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-950 dark:text-white"
                : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white",
            )}
          >
            {t(`flashcards.direction.${option}`)}
          </button>
        ))}
      </div>
    </div>
  );
};
