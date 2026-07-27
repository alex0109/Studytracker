"use client";

import { FC, useEffect, useState } from "react";
import { useDebounce } from "@/shared/hooks";
import { AccordionContent } from "@/entities/question";
import { useQuestionUpdate } from "../../hooks/useQuestionUpdate";

interface QuestionAnswerProps {
  materialId: string;
  id: string;
  answer: string;
  deleteQuestion: (id: string) => void;
}

export const QuestionAnswer: FC<QuestionAnswerProps> = ({
  materialId,
  id,
  answer,
  deleteQuestion,
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
    <AccordionContent deleteQuestion={() => deleteQuestion(id)}>
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
