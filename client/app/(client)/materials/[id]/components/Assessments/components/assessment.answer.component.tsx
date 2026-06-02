import { FC, useEffect, useState } from "react";
import AccordionContent from "./accordion.content.component";
import useAssessmentUpdate from "@/app/(client)/materials/hooks/assessment/useAssessmentUpdate.hook";
import useDebounce from "@/shared/hooks/use-debounce.hook";

interface AssessmentAnswerProps {
  materialId: string;
  id: string;
  answer: string;
  deleteAssessment: (id: string) => void;
}

const AssessmentAnswer: FC<AssessmentAnswerProps> = ({
  materialId,
  id,
  answer,
  deleteAssessment,
}) => {
  const [answerValue, setAnswerValue] = useState(answer);
  const { updateAssessment } = useAssessmentUpdate(materialId, id);

  const debouncedAnswerValue = useDebounce(answerValue, 1500);

  useEffect(() => {
    if (answer !== debouncedAnswerValue) {
      updateAssessment({ dataToUpdate: { answer: debouncedAnswerValue } });
    }
  }, [id, answer, debouncedAnswerValue]);

  const onUpdateAnswer = (newAnswer: string) => {
    setAnswerValue(newAnswer);
  };
  return (
    <AccordionContent deleteAssessment={() => deleteAssessment(id)}>
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

export default AssessmentAnswer;
