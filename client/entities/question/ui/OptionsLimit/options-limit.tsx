"use client";

import { FC } from "react";
import { LuInfo } from "react-icons/lu";
import { cn } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";
import { MAX_OPTIONS } from "../../consts";

// "4 of 6" next to the options label: the limit is visible before it is reached
export const OptionsCount: FC<{ count: number }> = ({ count }) => {
  const { t } = useTranslation();

  return (
    <span
      className={cn(
        "shrink-0 text-xs tabular-nums",
        count >= MAX_OPTIONS ? "font-medium text-amber-600 dark:text-amber-400" : "text-neutral-400",
      )}
    >
      {t("questions.options.count", { current: count, max: MAX_OPTIONS })}
    </span>
  );
};

// Shown in place of the "add option" control once the question has all it can hold
export const OptionsLimitNote: FC = () => {
  const { t } = useTranslation();

  return (
    <p
      role="status"
      className="flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
    >
      <LuInfo aria-hidden className="mt-0.5 shrink-0" />
      {t("questions.options.limitReached", { max: MAX_OPTIONS })}
    </p>
  );
};
