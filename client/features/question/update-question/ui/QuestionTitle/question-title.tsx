"use client";

import { FC, useEffect, useState } from "react";
import { useDebounce } from "@/shared/hooks";
import { useQuestionUpdate } from "../../hooks/useQuestionUpdate";
import { AccordionTrigger } from "@/entities/question";
import { IsPendingLoader } from "@/shared/ui";

interface QuestionTitleProps {
  materialId: string;
  id: string;
  title: string;
}

export const QuestionTitle: FC<QuestionTitleProps> = ({
  materialId,
  id,
  title,
}) => {
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
  }, [id, title, debouncedTitleValue]);

  const onUpdateTitle = (newTitle: string) => {
    setTitleValue(newTitle);
  };

  return (
    <AccordionTrigger>
      <div className="flex w-full justify-start items-center">
        <div className="flex-8 w-full">
          <textarea
            value={titleValue}
            className="text-xl font-bold border-0 w-full resize-none 
                  wrap-break-word overflow-hidden outline-none"
            onChange={(e) => onUpdateTitle(e.target.value)}
            maxLength={70}
          />
        </div>
        <div className="flex flex-1 justify-end">
          <IsPendingLoader isPending={updateQuestionIsPending} />
        </div>
      </div>
    </AccordionTrigger>
  );
};
