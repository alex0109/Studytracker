import { FC, useEffect, useState } from "react";
import AccordionTrigger from "./accordion.trigger.component";
import useDebounce from "@/shared/hooks/use-debounce.hook";
import useQuestionUpdate from "@/app/(client)/materials/hooks/question/useQuestionUpdate.hook";

interface QuestionTitleProps {
  materialId: string;
  id: string;
  title: string;
}

const QuestionTitle: FC<QuestionTitleProps> = ({ materialId, id, title }) => {
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

export default QuestionTitle;
