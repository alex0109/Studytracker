"use client";

import { FC, useState } from "react";
import ContainerColumn from "@/shared/components/container-column";
import ContainerRow from "@/shared/components/container-row";
import Subtitle from "@/shared/components/subtitle";
import TextArea from "@/shared/components/text-area";
import { Button } from "@/shared/components/ui/button";
import { motion } from "framer-motion";
import { IResult } from "@/app/types/result/result.type";

interface QuestionItemProps {
  questionId: string;
  assessmentId: string;
  index: number;
  title: string;
  submitAnswer: (body: Partial<IResult>) => void;
}

const QuestionItem: FC<QuestionItemProps> = ({
  questionId,
  assessmentId,
  index,
  title,
  submitAnswer,
}) => {
  const [textAreaVlaue, setTextAreaValue] = useState<string>("");

  const handleSubmitAnswer = () => {
    submitAnswer({ assessmentId, questionId, userAnswer: textAreaVlaue });
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <ContainerColumn>
        <ContainerRow blockStyles="items-center">
          <span className="text-xl font-bold">{index}.</span>
          <Subtitle text={title} />
        </ContainerRow>
        <div>
          <TextArea
            placeholder="Write down what you remember about this question..."
            inputStyles="w-full h-[300px] p-5 bg-neutral-200"
            value={textAreaVlaue}
            maxLength={1000}
            onChange={(e) => setTextAreaValue(e.target.value)}
          />
        </div>
        <Button
          className="self-end w-[150px]"
          onClick={() => handleSubmitAnswer()}
        >
          Answer
        </Button>
      </ContainerColumn>
    </motion.div>
  );
};

export default QuestionItem;
