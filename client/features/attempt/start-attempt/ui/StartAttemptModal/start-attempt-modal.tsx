"use client";

import { FC } from "react";
import { LuPlay } from "react-icons/lu";
import { IAssessment, IAssessmentSettings, useAssessment } from "@/entities/assessment";
import { useQuestionAll } from "@/entities/question";
import { Skeleton } from "@/shared/radix-ui";
import { Modal } from "@/shared/ui";
import { useTranslation } from "@/shared/i18n";
import { useAttemptStart } from "../../hooks/useAttemptStart";
import { useExamSettingsSave } from "../../hooks/useExamSettingsSave";
import { countByDifficulty } from "../../lib/count-by-difficulty";
import { StartAttemptForm } from "./start-attempt-form";

interface StartAttemptModalProps {
  open: boolean;
  onClose: () => void;
  materialId: string;
  assessmentId: string;
  onStarted: (attemptId: string) => void;
  // Still busy after the start, until the attempt page opens
  isOpening?: boolean;
}

const isSameChoice = (saved: IAssessment, next: IAssessmentSettings) =>
  (saved.timerMinutes ?? null) === next.timerMinutes &&
  (saved.questionCount ?? null) === next.questionCount &&
  saved.difficulties.length === next.difficulties.length &&
  saved.difficulties.every((level) => next.difficulties.includes(level));

// Every start goes through here: the levels, how many questions and the timer, then the attempt.
// The choice is kept for the next start
export const StartAttemptModal: FC<StartAttemptModalProps> = ({
  open,
  onClose,
  materialId,
  assessmentId,
  onStarted,
  isOpening = false,
}) => {
  const { t } = useTranslation();
  const { assessment } = useAssessment(assessmentId);
  const { questionsData } = useQuestionAll(materialId);
  const { saveExamSettings, saveExamSettingsIsPending } = useExamSettingsSave(assessmentId);
  const { attemptStart, startAttemptIsPending } = useAttemptStart(assessmentId);

  const start = async (settings: IAssessmentSettings) => {
    try {
      if (!assessment || !isSameChoice(assessment, settings)) await saveExamSettings(settings);
      onStarted(await attemptStart());
    } catch {
      // The hooks already tell the user
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      tone="success"
      icon={<LuPlay />}
      title={t("exam.title")}
      description={t("exam.subtitle")}
    >
      {assessment && questionsData ? (
        <StartAttemptForm
          saved={assessment}
          counts={countByDifficulty(questionsData)}
          busy={saveExamSettingsIsPending || startAttemptIsPending || isOpening}
          onCancel={onClose}
          onSubmit={start}
        />
      ) : (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      )}
    </Modal>
  );
};
