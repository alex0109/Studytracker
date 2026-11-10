"use client";

import { FC, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuUndo2 } from "react-icons/lu";
import { SaveStatus, VoiceField } from "@/shared/ui";
import { useTranslation } from "@/shared/i18n";
import { useQuestionUpdate } from "../../hooks/useQuestionUpdate";
import { useAutosaveText } from "../../lib/use-autosave-text";
import { FieldLabel, fieldClass } from "../FieldLabel/field-label";

interface QuestionAnswerFieldProps {
  materialId: string;
  id: string;
  answer: string;
}

const MAX_ANSWER = 1000;

// The answer saves itself, so a slip can't be taken back by not saving. "Back" brings the answer
// as it was when the question was opened, and appears only once it has changed
export const QuestionAnswerField: FC<QuestionAnswerFieldProps> = ({ materialId, id, answer }) => {
  const { t } = useTranslation();
  const [original] = useState(answer);
  const { updateQuestion, updateQuestionIsPending, updateQuestionIsError } = useQuestionUpdate(materialId, id);
  const { value, setValue, flush } = useAutosaveText(answer, (next) =>
    updateQuestion({ dataToUpdate: { answer: next } }),
  );

  const changed = value !== original;

  const restore = () => {
    setValue(original);
    flush(original);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel
        htmlFor={`question-answer-${id}`}
        aside={
          <span className="flex items-center gap-1.5">
            <AnimatePresence>
              {changed && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={restore}
                  title={t("questions.editor.undoHint")}
                  className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                >
                  <LuUndo2 aria-hidden className="size-3" />
                  {t("questions.editor.undo")}
                </motion.button>
              )}
            </AnimatePresence>
            <SaveStatus isPending={updateQuestionIsPending} isError={updateQuestionIsError} />
          </span>
        }
      >
        {t("questions.answerLabel")}
      </FieldLabel>
      <VoiceField value={value} maxLength={MAX_ANSWER} onChange={setValue}>
        <textarea
          id={`question-answer-${id}`}
          value={value}
          rows={2}
          maxLength={MAX_ANSWER}
          placeholder={t("questions.answerPlaceholder")}
          onChange={(event) => setValue(event.target.value)}
          onBlur={() => flush(value)}
          className={fieldClass}
        />
      </VoiceField>
    </div>
  );
};
