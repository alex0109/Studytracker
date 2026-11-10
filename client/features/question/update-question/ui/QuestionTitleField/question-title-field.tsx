"use client";

import { FC } from "react";
import { SaveStatus } from "@/shared/ui";
import { useTranslation } from "@/shared/i18n";
import { useQuestionUpdate } from "../../hooks/useQuestionUpdate";
import { useAutosaveText } from "../../lib/use-autosave-text";
import { FieldLabel, fieldClass } from "../FieldLabel/field-label";

interface QuestionTitleFieldProps {
  materialId: string;
  id: string;
  title: string;
  // True/false questions are a statement, not a question
  isStatement?: boolean;
}

// Same limit as the database column
const MAX_TITLE = 100;

export const QuestionTitleField: FC<QuestionTitleFieldProps> = ({ materialId, id, title, isStatement }) => {
  const { t } = useTranslation();
  const { updateQuestion, updateQuestionIsPending, updateQuestionIsError } = useQuestionUpdate(materialId, id);
  const { value, setValue, flush } = useAutosaveText(
    title,
    (next) => updateQuestion({ dataToUpdate: { title: next.trim() } }),
    { allowEmpty: false },
  );

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel
        htmlFor={`question-title-${id}`}
        aside={<SaveStatus isPending={updateQuestionIsPending} isError={updateQuestionIsError} />}
      >
        {isStatement ? t("questions.statementLabel") : t("questions.titleLabel")}
      </FieldLabel>
      <textarea
        id={`question-title-${id}`}
        value={value}
        rows={1}
        maxLength={MAX_TITLE}
        onChange={(event) => setValue(event.target.value)}
        onBlur={() => flush(value)}
        className={`${fieldClass} font-medium`}
      />
    </div>
  );
};
