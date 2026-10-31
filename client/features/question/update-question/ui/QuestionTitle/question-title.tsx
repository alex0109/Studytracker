"use client";

import { FC, useEffect, useState } from "react";
import { useDebounce } from "@/shared/hooks";
import { useQuestionUpdate } from "../../hooks/useQuestionUpdate";
import { AccordionTrigger, IsPendingLoader } from "@/shared/ui";
import {
  IQuestionProgress,
  QuestionReviewBadge,
  QuestionTypeEnum,
  questionTypeKeys,
} from "@/entities/question";
import { useTranslation } from "@/shared/i18n";

interface QuestionTitleProps {
  materialId: string;
  noteId?: string;
  id: string;
  title: string;
  questionType?: QuestionTypeEnum;
  progress?: IQuestionProgress | null;
}

export const QuestionTitle: FC<QuestionTitleProps> = ({
  materialId,
  noteId,
  id,
  title,
  questionType,
  progress,
}) => {
  const { t } = useTranslation();
  const [titleValue, setTitleValue] = useState(title);
  const { updateQuestion, updateQuestionIsPending } = useQuestionUpdate(
    materialId,
    id,
  );

  const debouncedTitleValue = useDebounce(titleValue, 1500);

  useEffect(() => {
    if (title !== debouncedTitleValue) {
      updateQuestion({ dataToUpdate: { title: debouncedTitleValue } });
    }
  }, [id, title, debouncedTitleValue, updateQuestion]);

  const onUpdateTitle = (newTitle: string) => {
    setTitleValue(newTitle);
  };

  return (
    <AccordionTrigger
      className="all-unset font-[inherit] px-5 py-[5px] min-h-10 h-auto flex-1
    flex items-start justify-between
    text-xl font-semibold leading-none
    duration-[400ms] hover:bg-neutral-200/70 dark:hover:bg-neutral-800"
    >
      <div className="flex w-full justify-start items-center">
        <div className="flex flex-col flex-8 w-full">
          <textarea
            value={titleValue}
            aria-label={t("questions.titleLabel")}
            className="text-xl font-bold border-0 w-full resize-none bg-transparent
                  wrap-break-word overflow-hidden outline-none"
            onChange={(e) => onUpdateTitle(e.target.value)}
            maxLength={70}
          />
          <div className="flex flex-wrap items-center gap-2">
            {questionType && (
              <p className="text-xs text-neutral-500">
                {t(`questions.types.${questionTypeKeys[questionType]}`)}
              </p>
            )}
            {noteId && (
              <p className="text-xs text-neutral-500">
                {" "}
                {t("questions.fromNote", { id: noteId.split("-")[0] })}
              </p>
            )}
            <QuestionReviewBadge progress={progress} />
          </div>
        </div>
        <div className="flex flex-1 justify-end">
          <IsPendingLoader isPending={updateQuestionIsPending} />
        </div>
      </div>
    </AccordionTrigger>
  );
};
