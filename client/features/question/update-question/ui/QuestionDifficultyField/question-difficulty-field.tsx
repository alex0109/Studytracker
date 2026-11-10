"use client";

import { FC, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { QuestionDifficultyEnum } from "@/entities/question";
import { SaveStatus } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";
import { useQuestionUpdate } from "../../hooks/useQuestionUpdate";
import { FieldLabel } from "../FieldLabel/field-label";

const LEVELS = [
  { value: QuestionDifficultyEnum.Easy, dot: "bg-emerald-500", weight: 1 },
  { value: QuestionDifficultyEnum.Medium, dot: "bg-amber-500", weight: 2 },
  { value: QuestionDifficultyEnum.Hard, dot: "bg-rose-500", weight: 3 },
] as const;

interface QuestionDifficultyFieldProps {
  materialId: string;
  id: string;
  difficulty: QuestionDifficultyEnum;
}

// Three levels side by side; a harder question weighs more in the score
export const QuestionDifficultyField: FC<QuestionDifficultyFieldProps> = ({ materialId, id, difficulty }) => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(difficulty);
  const { updateQuestion, updateQuestionIsPending, updateQuestionIsError } = useQuestionUpdate(materialId, id);

  const choose = (next: QuestionDifficultyEnum) => {
    if (next === value) return;
    setValue(next);
    updateQuestion({ dataToUpdate: { questionDifficulty: next } });
  };

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel aside={<SaveStatus isPending={updateQuestionIsPending} isError={updateQuestionIsError} />}>
        {t("questions.difficultyLabel")}
      </FieldLabel>
      <div role="radiogroup" aria-label={t("questions.difficultyLabel")} className="grid grid-cols-3 gap-1 rounded-xl bg-neutral-100 p-1 dark:bg-neutral-900">
        {LEVELS.map((level) => {
          const isActive = level.value === value;

          return (
            <button
              key={level.value}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => choose(level.value)}
              className={cn(
                "relative flex h-9 items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition-colors",
                isActive ? "text-neutral-900 dark:text-white" : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId={`difficulty-${id}`}
                  aria-hidden
                  className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-neutral-800"
                  transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 38 }}
                />
              )}
              <span className={cn("relative size-2 rounded-full", level.dot)} aria-hidden />
              <span className="relative">{t(`questions.difficulty.${level.value}`)}</span>
              <span className="relative hidden text-xs text-neutral-400 sm:inline">×{level.weight}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
