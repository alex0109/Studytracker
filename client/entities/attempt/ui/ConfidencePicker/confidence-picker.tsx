"use client";

import { FC } from "react";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { IConfidenceLevel } from "../../model";

// Labels are translation keys under "attempt.confidence"
const OPTIONS = [
  { value: IConfidenceLevel.Low, key: "low" },
  { value: IConfidenceLevel.Medium, key: "medium" },
  { value: IConfidenceLevel.High, key: "high" },
] as const;

interface ConfidencePickerProps {
  value?: IConfidenceLevel;
  onChange: (value: IConfidenceLevel) => void;
}

// "How sure are you?" next to an answer: low, medium or high, optional
export const ConfidencePicker: FC<ConfidencePickerProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-col gap-1.5 sm:w-auto">
      <span className="text-xs text-neutral-500">{t("attempt.confidenceShort")}</span>
      <div className="flex w-full rounded-full bg-neutral-100 p-1 sm:inline-flex sm:w-fit dark:bg-neutral-800">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex-1 whitespace-nowrap rounded-full px-3 py-3 text-base font-medium transition-colors sm:flex-none sm:py-1 sm:text-xs",
              value === option.value
                ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-600 dark:text-white"
                : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200",
            )}
          >
            {t(`attempt.confidence.${option.key}`)}
          </button>
        ))}
      </div>
    </div>
  );
};
