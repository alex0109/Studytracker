import { FC, useEffect, useState } from "react";
import AccordionTrigger from "./accordion.trigger.component";
import useDebounce from "@/shared/hooks/use-debounce.hook";
import useAssessmentUpdate from "@/app/(client)/materials/hooks/assessment/useAssessmentUpdate.hook";

interface AssessmentTitleProps {
  materialId: string;
  id: string;
  title: string;
}

const AssessmentTitle: FC<AssessmentTitleProps> = ({
  materialId,
  id,
  title,
}) => {
  const [titleValue, setTitleValue] = useState(title);
  const { updateAssessment } = useAssessmentUpdate(materialId, id);

  const debouncedTitleValue = useDebounce(titleValue, 1500);

  useEffect(() => {
    if (title !== debouncedTitleValue) {
      updateAssessment({ dataToUpdate: { title: debouncedTitleValue } });
    }
  }, [id, title, debouncedTitleValue]);

  const onUpdateTitle = (newTitle: string) => {
    setTitleValue(newTitle);
  };

  return (
    <AccordionTrigger>
      <textarea
        value={titleValue}
        className="text-2xl font-bold border-0 w-full resize-none 
                  wrap-break-word overflow-hidden outline-none"
        onChange={(e) => onUpdateTitle(e.target.value)}
        maxLength={70}
      />
    </AccordionTrigger>
  );
};

export default AssessmentTitle;
