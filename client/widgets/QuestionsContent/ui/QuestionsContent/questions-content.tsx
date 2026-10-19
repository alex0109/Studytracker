"use client";

import { FC, useState } from "react";
import { InProductionModal } from "@/shared/ui";
import { Button } from "@/shared/radix-ui";
import { cn } from "@/shared/lib";
import { useQuestionAll } from "@/entities/question";
import { useRouter, usePathname } from "next/navigation";
import { OpenQuestionCreateModal } from "@/features/question/create-question/ui";
import { useAttemptStart } from "@/features/attempt/start-attempt";
import { questionInterface } from "../../lib/question-interface";
import { QuestionsAccordion } from "./questions-accordion";
import { EmptyQuestions } from "./empty-questions";
import LoadingQuestions from "./loading-questions";

interface QuestionsType {
  materialId: string;
  noteId?: string;
  assessmentId: string;
}

export const QuestionsContent: FC<QuestionsType> = ({
  materialId,
  noteId,
  assessmentId,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [inProductionIsOpen, setInProductionIsOpen] = useState(false);

  const router = useRouter();
  const path = usePathname();

  const { questionsData, questionsIsPending } = useQuestionAll(materialId);

  const { attemptStart, startAttemptIsPending } = useAttemptStart(assessmentId);

  const startAttemptHandler = async () => {
    const attempt = await attemptStart();

    router.push(`${path}/${materialId}/attempt/${attempt}`);
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

  const questionsAfterFilter = noteId
    ? questionsData?.filter((item) => item.noteId)
    : questionsData;

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

      <div>
        {questionsIsPending ? (
          <LoadingQuestions />
        ) : questionsAfterFilter &&
          questionsAfterFilter.length > 0 &&
          questionsAfterFilter.filter((item) => item.isActive == true).length >
            0 ? (
          <QuestionsAccordion
            materialId={materialId}
            noteId={noteId}
            questionsData={questionsAfterFilter}
            questionsIsPending={questionsIsPending}
          />
        ) : (
          <EmptyQuestions />
        )}
      </div>

      <OpenQuestionCreateModal
        materialId={materialId}
        noteId={noteId}
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
