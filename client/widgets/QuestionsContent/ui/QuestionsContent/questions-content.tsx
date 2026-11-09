"use client";

import { FC, useState } from "react";
import { Spinner } from "@/shared/ui";
import { Button } from "@/shared/radix-ui";
import { cn } from "@/shared/lib";
import { useQuestionAll } from "@/entities/question";
import { usePathname } from "next/navigation";
import { usePendingNavigation } from "@/shared/lib/use-pending-navigation";
import { QuestionCreateModal } from "@/features/question/create-question/ui";
import { GenerateQuestionsModal } from "@/features/question/generate-questions";
import { StartAttemptModal } from "@/features/attempt/start-attempt";
import { questionInterface } from "../../lib/question-interface";
import { useTranslation } from "@/shared/i18n";
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
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);
  const [generateIsOpen, setGenerateIsOpen] = useState(false);
  const [startIsOpen, setStartIsOpen] = useState(false);

  const { navigate, isNavigating } = usePendingNavigation();
  const path = usePathname();

  const { questionsData, questionsIsPending } = useQuestionAll(materialId);

  const onClickhandlers = {
    "open-modal": () => setOpen(true),
    generate: () => setGenerateIsOpen(true),
    // The test is set up before every start
    start: () => setStartIsOpen(true),
  };

  // The server draws only from active questions
  const canStart = !!questionsData?.some((item) => item.isActive) && !isNavigating;

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
            disabled={item.key === "start" && !canStart}
            className={`lg:w-[250px] md:w-[180px] sm:w-[180px] w-full ${cn(item.styles)}`}
          >
            {item.key === "start" && isNavigating ? <Spinner /> : item.icon}{" "}
            {t(`questions.actions.${item.title}`)}
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
      <StartAttemptModal
        open={startIsOpen}
        onClose={() => setStartIsOpen(false)}
        materialId={materialId}
        assessmentId={assessmentId}
        isOpening={isNavigating}
        onStarted={(attemptId) => navigate(`${path}/${materialId}/attempt/${attemptId}`)}
      />
      <GenerateQuestionsModal
        materialId={materialId}
        noteId={noteId}
        open={generateIsOpen}
        setOpen={setGenerateIsOpen}
      />
    </div>
  );
};
