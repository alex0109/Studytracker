"use client";

import { FC } from "react";
import { LuCheck, LuX } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { IOption, isTrueFalseName } from "@/entities/question";

interface AnswerChoicesProps {
  options: IOption[];
  isTrueFalse: boolean;
  selectedIds: string[];
  onSelect: (optionId: string) => void;
}

// The choices of a question: two coloured pills for true or false, or lettered options to tick
export const AnswerChoices: FC<AnswerChoicesProps> = ({ options, isTrueFalse, selectedIds, onSelect }) => {
  const { t } = useTranslation();

  if (isTrueFalse) {
    return (
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isTrue = option.name.toLowerCase() === "true";
          const isSelected = selectedIds.includes(option.id);

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(option.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border-2 px-5 py-2 text-sm font-semibold transition-colors max-sm:min-h-12 max-sm:px-6 max-sm:text-base",
                isSelected
                  ? isTrue
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-rose-600 bg-rose-600 text-white"
                  : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200",
              )}
            >
              {isTrue ? <LuCheck /> : <LuX />}
              {isTrueFalseName(option.name) ? t(isTrue ? "questions.true" : "questions.false") : option.name}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {options.map((option, index) => {
        const isSelected = selectedIds.includes(option.id);

        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(option.id)}
            className={cn(
              "flex min-h-12 w-full items-center gap-3 rounded-xl border-2 px-3 py-3 text-left transition-colors sm:min-h-0 sm:py-2.5",
              isSelected
                ? "border-emerald-600 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-100"
                : "border-neutral-200 bg-white hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-800",
            )}
          >
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-bold",
                isSelected ? "bg-emerald-600 text-white" : "bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-200",
              )}
            >
              {isSelected ? <LuCheck /> : String.fromCharCode(65 + index)}
            </span>
            <span className="break-words">{option.name}</span>
          </button>
        );
      })}
    </div>
  );
};
