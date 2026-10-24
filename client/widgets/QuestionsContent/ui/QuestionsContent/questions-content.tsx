"use client";

import { FC, useState } from "react";
import { LimitCounter } from "@/shared/ui";
import { useLimits } from "@/entities/limits";
import { Button } from "@/shared/radix-ui";
import { cn, isLimitReached } from "@/shared/lib";
import { useQuestionAll } from "@/entities/question";
import { useRouter, usePathname } from "next/navigation";
import { QuestionCreateModal } from "@/features/question/create-question/ui";
import { GenerateQuestionsModal } from "@/features/question/generate-questions";
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
  const [generateIsOpen, setGenerateIsOpen] = useState(false);

  const router = useRouter();
  const path = usePathname();

  const { questionsData, questionsIsPending } = useQuestionAll(materialId);
  const { limitsData } = useLimits();

  // Limit is per material, so notes share it with the material itself
  const activeQuestionsCount =
    questionsData?.filter((item) => item.isActive).length ?? 0;
  const isQuestionsFull = isLimitReached(
    activeQuestionsCount,
    limitsData?.maxQuestionsPerMaterial,
  );

  const { attemptStart, startAttemptIsPending } = useAttemptStart(assessmentId);

  const startAttemptHandler = async () => {
    const attempt = await attemptStart();

    router.push(`${path}/${materialId}/attempt/${attempt}`);
  };

  const onClickhandlers = {
    "open-modal": () => setOpen(true),
    generate: () => setGenerateIsOpen(true),
    start: () => startAttemptHandler(),
  };

  const disabledHandlers = {
    "open-modal": isQuestionsFull,
    generate: isQuestionsFull,
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
      <div className="w-full flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-5 justify-center items-center my-5">
        {questionInterface.map((item) => (
          <Button
            size="lg"
            key={item.key}
            onClick={onClickhandlers[item.key]}
            disabled={disabledHandlers[item.key]}
            className={`lg:w-[250px] md:w-[180px] sm:w-[180px] w-full ${cn(item.styles)}`}
          >
            {item.icon}{" "}
            {item.key === "open-modal" && isQuestionsFull
              ? "Questions limit reached"
              : item.title}
            {item.key === "open-modal" && (
              <LimitCounter
                used={activeQuestionsCount}
                max={limitsData?.maxQuestionsPerMaterial}
                label="questions in this material"
              />
            )}
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

      <QuestionCreateModal
        materialId={materialId}
        noteId={noteId}
        open={open}
        setOpen={setOpen}
      />
      <GenerateQuestionsModal
        materialId={materialId}
        noteId={noteId}
        freeSlots={
          (limitsData?.maxQuestionsPerMaterial ?? Infinity) -
          activeQuestionsCount
        }
        open={generateIsOpen}
        setOpen={setGenerateIsOpen}
      />
    </div>
  );
};
