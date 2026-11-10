"use client";

import { useTranslation } from "@/shared/i18n";
import { isTrueFalseName } from "@/entities/question";
import { FC } from "react";
import { IOption } from "@/entities/question";
import { SaveStatus } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { useQuestionUpdate } from "../../hooks/useQuestionUpdate";
import { FieldLabel } from "../FieldLabel/field-label";

interface QuestionTrueFalseFieldProps {
  materialId: string;
  id: string;
  options: IOption[];
}

export const QuestionTrueFalseField: FC<QuestionTrueFalseFieldProps> = ({ materialId, id, options }) => {
  const { t } = useTranslation();
  const { updateQuestion, updateQuestionIsPending, updateQuestionIsError } = useQuestionUpdate(materialId, id);

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel aside={<SaveStatus isPending={updateQuestionIsPending} isError={updateQuestionIsError} />}>
        {t("questions.statementIs")}
      </FieldLabel>
      <div role="radiogroup" aria-label={t("questions.statementIs")} className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={option.isCorrect}
            disabled={updateQuestionIsPending || option.isCorrect}
            onClick={() => updateQuestion({ dataToUpdate: { correctOptionId: option.id } })}
            className={cn(
              "h-10 rounded-xl text-sm font-medium transition-colors disabled:cursor-default",
              option.isCorrect
                ? "bg-emerald-600 text-white"
                : "border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300",
            )}
          >
            {isTrueFalseName(option.name)
              ? t(option.name === "True" ? "questions.true" : "questions.false")
              : option.name}
          </button>
        ))}
      </div>
    </div>
  );
};
