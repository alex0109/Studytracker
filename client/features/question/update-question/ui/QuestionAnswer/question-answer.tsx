"use client";

import { FC, useEffect, useState } from "react";
import { useDebounce } from "@/shared/hooks";
import { useQuestionUpdate } from "../../hooks/useQuestionUpdate";
import { Button } from "@/shared/radix-ui";
import { LuTrash2 } from "react-icons/lu";
import { AccordionContent } from "@/shared/ui";

interface QuestionAnswerProps {
  materialId: string;
  id: string;
  answer: string;
  deleteQuestion: (id: string) => void;
  openValue: boolean;
}

export const QuestionAnswer: FC<QuestionAnswerProps> = ({
  materialId,
  id,
  answer,
  deleteQuestion,
  openValue,
}) => {
  const [answerValue, setAnswerValue] = useState(answer);
  const { updateQuestion } = useQuestionUpdate(materialId, id);

  const debouncedAnswerValue = useDebounce(answerValue, 1500);

  useEffect(() => {
    if (answer !== debouncedAnswerValue) {
      updateQuestion({ dataToUpdate: { answer: debouncedAnswerValue } });
    }
  }, [id, answer, debouncedAnswerValue]);

  const onUpdateAnswer = (newAnswer: string) => {
    setAnswerValue(newAnswer);
  };
  return (
    <AccordionContent
      isOpen={openValue}
      className="overflow-hidden text-base pl-[15px]
    data-[state=open]:animate-slideDown
    data-[state=closed]:animate-slideUp"
      actions={
        <Button
          size="lg"
          variant="destructive"
          onClick={() => deleteQuestion(id)}
        >
          <LuTrash2 />
        </Button>
      }
    >
      <textarea
        value={answerValue}
        className="border-0 w-full resize-none pr-3
                  wrap-break-word overflow-hidden outline-none"
        onChange={(e) => onUpdateAnswer(e.target.value)}
        maxLength={1000}
      />
    </AccordionContent>
  );
};
