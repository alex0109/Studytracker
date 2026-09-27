"use client";

import { FC, useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { InProductionModal } from "@/shared/ui";
import styles from "@/shared/ui/Accordion/styles.module.css";
import { Button } from "@/shared/radix-ui";
import { cn } from "@/shared/lib";
import { useQuestionAll } from "@/entities/question";
import { useRouter, usePathname } from "next/navigation";
import { OpenQuestionCreateModal } from "@/features/question/create-question/ui";
import {
  QuestionAnswer,
  QuestionTitle,
} from "@/features/question/update-question/ui";
import { useQuestionDelete } from "@/features/question/delete-question";
import { useAttemptStart } from "@/features/attempt/start-attempt";
import { questionInterface } from "../../lib/question-interface";
import { EmptyQuestions } from "./empty-questions";
import LoadingQuestions from "./loading-questions";

interface QuestionsType {
  materialId: string;
  assessmentId: string;
}

export const QuestionsContent: FC<QuestionsType> = ({
  materialId,
  assessmentId,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [openValue, setOpenValue] = useState<string | undefined>();
  const [inProductionIsOpen, setInProductionIsOpen] = useState(false);

  const router = useRouter();
  const path = usePathname();

  const { questionsData, questionsIsPending } = useQuestionAll(materialId);
  const { deleteQuestion } = useQuestionDelete(materialId);

  const { attemptStart, startAttemptIsPending } = useAttemptStart(assessmentId);

  const startAttemptHandler = async () => {
    const attempt = await attemptStart();

    router.push(`${path}/attempt/${attempt}`);
  };

  const onClickhandlers = {
    "open-modal": () => setOpen(true),
    generate: () => setInProductionIsOpen(true),
    start: () => startAttemptHandler(),
  };

  const disabledHandlers = {
    "open-modal": false,
    generate: false,
    start:
      questionsData && questionsData.length > 0 && !startAttemptIsPending
        ? false
        : true,
  };

  return (
    <div className="flex flex-col w-full">
      <div className="w-full flex sm:flex-wrap gap-5 justify-center items-center my-5">
        {questionInterface.map((item) => (
          <Button
            size="lg"
            key={item.key}
            onClick={onClickhandlers[item.key]}
            disabled={disabledHandlers[item.key]}
            className={`lg:w-[250px] md:w-[180px] sm:w-[180px] w-full ${cn(item.styles)}`}
          >
            {item.icon} {item.title}
          </Button>
        ))}
      </div>
      {questionsIsPending ? (
        <LoadingQuestions />
      ) : questionsData &&
        questionsData.length > 0 &&
        questionsData.filter((item) => item.isActive == true).length > 0 ? (
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
              <Accordion.Item
                key={item.id}
                className={styles.Item}
                value={item.id}
              >
                <QuestionTitle
                  materialId={item.materialId}
                  id={item.id}
                  title={item.title}
                />
                <QuestionAnswer
                  materialId={item.materialId}
                  id={item.id}
                  answer={item.answer!}
                  deleteQuestion={deleteQuestion}
                  openValue={openValue === item.id}
                />
              </Accordion.Item>
            ))}
        </Accordion.Root>
      ) : (
        <EmptyQuestions />
      )}
      <OpenQuestionCreateModal
        materialId={materialId}
        open={open}
        setOpen={setOpen}
      />
      <InProductionModal
        isOpen={inProductionIsOpen}
        setIsOpen={setInProductionIsOpen}
      />
    </div>
  );
};
