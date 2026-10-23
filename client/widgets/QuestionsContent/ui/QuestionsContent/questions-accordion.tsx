"use client";

import * as Accordion from "@radix-ui/react-accordion";
import styles from "@/shared/ui/Accordion/styles.module.css";
import {
  QuestionAnswer,
  QuestionOptions,
  QuestionTitle,
  QuestionTrueFalse,
} from "@/features/question/update-question/ui";
import { IQuestionResponse, QuestionTypeEnum } from "@/entities/question";
import { FC, useState } from "react";
import { useQuestionDelete } from "@/features/question/delete-question";

interface QuestionsAccordionProps {
  materialId: string;
  noteId?: string;
  questionsIsPending: boolean;
  questionsData: IQuestionResponse[];
}

export const QuestionsAccordion: FC<QuestionsAccordionProps> = ({
  materialId,
  questionsData,
}) => {
  const [openValue, setOpenValue] = useState<string | undefined>(undefined);

  const { deleteQuestion } = useQuestionDelete(materialId);

  return (
    <Accordion.Root
      className={styles.Root}
      type="single"
      value={openValue}
      onValueChange={setOpenValue}
      collapsible
    >
      {questionsData
        .filter((item) => item.isActive == true)
        .map((item) => (
          <Accordion.Item key={item.id} className={styles.Item} value={item.id}>
            <QuestionTitle
              materialId={item.materialId}
              noteId={item.noteId}
              id={item.id}
              title={item.title}
              questionType={item.questionType}
            />
            {item.questionType === QuestionTypeEnum.Options ? (
              <QuestionOptions
                materialId={item.materialId}
                id={item.id}
                options={item.options}
                deleteQuestion={deleteQuestion}
                openValue={openValue === item.id}
              />
            ) : item.questionType === QuestionTypeEnum.TrueFalse ? (
              <QuestionTrueFalse
                materialId={item.materialId}
                id={item.id}
                options={item.options}
                deleteQuestion={deleteQuestion}
                openValue={openValue === item.id}
              />
            ) : (
              <QuestionAnswer
                materialId={item.materialId}
                id={item.id}
                answer={item.answer ?? ""}
                deleteQuestion={deleteQuestion}
                openValue={openValue === item.id}
              />
            )}
          </Accordion.Item>
        ))}
    </Accordion.Root>
  );
};
