"use client";

import { FC } from "react";
import { LuCheck } from "react-icons/lu";
import { EXAM_DIFFICULTIES, ExamDifficulty } from "@/entities/assessment";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { DifficultyCounts } from "../../lib/count-by-difficulty";
import { DIFFICULTY_LABEL_KEYS } from "../../lib/difficulty-labels";

interface DifficultyTogglesProps {
  value: ExamDifficulty[];
  onChange: (value: ExamDifficulty[]) => void;
  // Active questions of each level, unknown while they load
  counts?: DifficultyCounts;
}

// Each level is switched on or off on its own; the last one left can't be switched off
export const DifficultyToggles: FC<DifficultyTogglesProps> = ({ value, onChange, counts }) => {
  const { t } = useTranslation();

  const toggle = (level: ExamDifficulty) =>
    onChange(
      value.includes(level)
        ? value.filter((item) => item !== level)
        : EXAM_DIFFICULTIES.filter((item) => item === level || value.includes(item)),
    );

  return (
    <div role="group" aria-label={t("exam.difficulty")} className="flex min-w-0 flex-col gap-1.5">
      <span aria-hidden className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {t("exam.difficulty")}
      </span>
      <div className="grid grid-cols-3 gap-2">
        {EXAM_DIFFICULTIES.map((level) => {
          const isOn = value.includes(level);
          const isLast = isOn && value.length === 1;

          return (
            <button
              key={level}
              type="button"
              aria-pressed={isOn}
              disabled={isLast}
              title={isLast ? t("exam.lastDifficulty") : undefined}
              onClick={() => toggle(level)}
              className={cn(
                "flex min-w-0 flex-col items-center gap-0.5 rounded-xl border-2 px-2 py-2 text-sm font-medium transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:cursor-not-allowed",
                isOn
                  ? "border-emerald-600 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-100"
                  : "border-neutral-200 text-neutral-500 hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-400",
              )}
            >
              <span className="flex max-w-full items-center gap-1">
                {isOn && <LuCheck aria-hidden className="size-3.5 shrink-0" />}
                <span className="truncate">{t(DIFFICULTY_LABEL_KEYS[level])}</span>
              </span>
              {counts && (
                <span className="text-xs font-normal tabular-nums opacity-70">
                  {t("exam.questionsCount", { count: counts[level] })}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
