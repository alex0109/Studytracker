"use client";

import { FC, useEffect, useState } from "react";
import { useDebounce } from "@/shared/hooks";
import { useQuestionUpdate } from "../../hooks/useQuestionUpdate";
import { AccordionTrigger } from "@/entities/question";

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
  const { updateQuestion } = useQuestionUpdate(materialId, id);

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
      <textarea
        value={titleValue}
        className="text-xl font-bold border-0 w-full resize-none 
                  wrap-break-word overflow-hidden outline-none"
        onChange={(e) => onUpdateTitle(e.target.value)}
        maxLength={70}
      />
    </AccordionTrigger>
  );
};
