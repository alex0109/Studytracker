"use client";

import { FC, useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { BlockColumn, ContainerRow, InProductionModal } from "@/shared/ui";
import styles from "./styles.module.css";
import { Button, Separator } from "@/shared/radix-ui";
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

interface QuestionsType {
  materialId: string;
  assessmentId: string;
}

export const QuestionsContent: FC<QuestionsType> = ({
  materialId,
  assessmentId,
}) => {
  const [open, setOpen] = useState(false);
  const [inProductionIsOpen, setInProductionIsOpen] = useState(false);

  const router = useRouter();
  const path = usePathname();

  const { questionsData } = useQuestionAll(materialId);
  const { deleteQuestion } = useQuestionDelete(materialId);

  const { attemptStart, startAttemptPending } = useAttemptStart(assessmentId);

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
      questionsData && questionsData.length > 0 && !startAttemptPending
        ? false
        : true,
  };

  return (
    <BlockColumn blockStyles="lg:p-[70px] p-3 items-start">
      <div className="w-full flex lg:flex-row flex-col gap-5 justify-between items-center mb-5">
        {questionInterface.map((item) => (
          <Button
            size="lg"
            key={item.key}
            onClick={onClickhandlers[item.key]}
            disabled={disabledHandlers[item.key]}
            className={`lg:w-[250px] md:w-[200px] sm:w-[200px] w-full ${cn(item.styles)}`}
          >
            {item.icon} {item.title}
          </Button>
        ))}
      </div>
      <Separator />
      {questionsData &&
      questionsData.length > 0 &&
      questionsData.filter((item) => item.isActive == true).length > 0 ? (
        <Accordion.Root
          className={styles.Root}
          type="single"
          defaultValue="item-1"
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
                />
              </Accordion.Item>
            ))}
        </Accordion.Root>
      ) : (
        <div className="flex w-full my-5 justify-center items-center">
          <p className="text-neutral-500 text-lg">
            There is no questions yet...
          </p>
        </div>
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
    </BlockColumn>
  );
};
