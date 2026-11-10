"use client";

import { FC } from "react";
import { SaveStatus } from "@/shared/ui";
import { useTranslation } from "@/shared/i18n";
import { useQuestionUpdate } from "../../hooks/useQuestionUpdate";
import { useAutosaveText } from "../../lib/use-autosave-text";
import { FieldLabel, fieldClass } from "../FieldLabel/field-label";

interface QuestionExplanationFieldProps {
  materialId: string;
  id: string;
  explanation?: string | null;
}

const MAX_EXPLANATION = 1000;

// Shown after a wrong answer, and the AI reads it when it explains the mistake
export const QuestionExplanationField: FC<QuestionExplanationFieldProps> = ({ materialId, id, explanation }) => {
  const { t } = useTranslation();
  const { updateQuestion, updateQuestionIsPending, updateQuestionIsError } = useQuestionUpdate(materialId, id);
  const { value, setValue, flush } = useAutosaveText(explanation ?? "", (next) =>
    updateQuestion({ dataToUpdate: { explanation: next } }),
  );

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel
        htmlFor={`question-explanation-${id}`}
        aside={<SaveStatus isPending={updateQuestionIsPending} isError={updateQuestionIsError} />}
      >
        {t("questions.editor.explanation")}
      </FieldLabel>
      <textarea
        id={`question-explanation-${id}`}
        value={value}
        rows={1}
        maxLength={MAX_EXPLANATION}
        placeholder={t("questions.editor.explanationPlaceholder")}
        onChange={(event) => setValue(event.target.value)}
        onBlur={() => flush(value)}
        className={`${fieldClass} text-sm`}
      />
    </div>
  );
};
