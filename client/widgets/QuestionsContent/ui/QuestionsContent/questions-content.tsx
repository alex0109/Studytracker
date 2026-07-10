import { FC, useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { BlockColumn, ContainerRow } from "@/shared/ui";
import styles from "./styles.module.css";
import { Button, Separator } from "@/shared/radix-ui";
import { cn } from "@/shared/lib";
import { useQuestionAll } from "@/entities/question";
import { useRouter, usePathname } from "next/navigation";
import { QuestionCreateModal } from "@/features/question/create-question/ui";
import {
  QuestionAnswer,
  QuestionTitle,
} from "@/features/question/update-question/ui";
import {
  useOpenQuestionCreate,
  useOptionsQuestionCreate,
} from "@/features/question/create-question";
import { useQuestionDelete } from "@/features/question/delete-question";
import { useAttemptStart } from "@/features/attempt/start-attempt";
import { questionInterface } from "../../lib/question-interface";

interface QuestionsType {
  id: string;
}

export const QuestionsContent: FC<QuestionsType> = ({ id }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const path = usePathname();

  const { questionsData } = useQuestionAll(id);
  const { createOpenQuestion } = useOpenQuestionCreate(id);
  const { createOptionsQuestion } = useOptionsQuestionCreate(id);
  const { deleteQuestion } = useQuestionDelete(id);

  const { startAttempt, startAttemptPending } = useAttemptStart(id);

  const startAssessmentHandler = async () => {
    const assessment = await startAttempt();

    router.push(`${path}/assessment/${assessment}`);
  };

  const onClickhandlers = {
    "open-modal": () => setOpen(true),
    generate: () => alert("Not working"),
    start: () => startAssessmentHandler(),
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
    <BlockColumn blockStyles="p-[70px] items-start">
      <div className="w-full flex justify-between items-center mb-5">
        {questionInterface.map((item) => (
          <Button
            key={item.key}
            onClick={onClickhandlers[item.key]}
            disabled={disabledHandlers[item.key]}
            className={`w-[200px] ${cn(item.styles)}`}
          >
            {item.icon} {item.title}
          </Button>
        ))}
      </div>
      <Separator />
      {questionsData && questionsData.length > 0 ? (
        <Accordion.Root
          className={styles.Root}
          type="single"
          defaultValue="item-1"
          collapsible
        >
          {questionsData.map((item) => (
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
              {item.questionType === "open" ? (
                <QuestionAnswer
                  materialId={item.materialId}
                  id={item.id}
                  answer={item.answer!}
                  deleteQuestion={deleteQuestion}
                />
              ) : (
                <></>
              )}
            </Accordion.Item>
          ))}
        </Accordion.Root>
      ) : (
        <ContainerRow blockStyles="justify-center items-center">
          <p className="text-neutral-500 text-lg">
            There is no questions yet...
          </p>
        </ContainerRow>
      )}
      <QuestionCreateModal
        open={open}
        setOpen={setOpen}
        createOpenQuestion={createOpenQuestion}
        createOptionsQuestion={createOptionsQuestion}
      />
    </BlockColumn>
  );
};
