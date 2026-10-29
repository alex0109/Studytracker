"use client";

import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LuFlag } from "react-icons/lu";
import { BlockColumn, IsPendingLoader } from "@/shared/ui";
import { AttemptHeader } from "@/entities/attempt/ui";
import { Button, toast } from "@/shared/radix-ui";
import { cn } from "@/shared/lib";
import { shuffleQuestions } from "@/widgets/Attempt/lib/shuffle-questions";
import { AttemptQuestion } from "@/widgets/Attempt/ui/AttemptQuestion/attempt-question";
import { IQuestionReduced } from "@/entities/question";
import { useAttemptFinish } from "@/features/attempt/finish-attempt";
import { useAttemptResults } from "@/entities/attempt";
import { ISavedAnswer } from "../../model/saved-answer.type";
import { useTranslation } from "@/shared/i18n";

interface AttemptProps {
  questionsActiveReduced: IQuestionReduced[];
  materialId: string;
  attemptId: string;
}

export const Attempt: FC<AttemptProps> = ({
  questionsActiveReduced,
  materialId,
  attemptId,
}) => {
  const { t } = useTranslation();
  const [questions] = useState(() =>
    shuffleQuestions([...questionsActiveReduced]),
  );
  const [savedAnswers, setSavedAnswers] = useState<
    Record<string, ISavedAnswer>
  >({});
  // Questions that had no answer when Finish was pressed
  const [highlightedIds, setHighlightedIds] = useState<string[]>([]);

  const router = useRouter();

  const { finishAttempt, finishAttemptIsPending } = useAttemptFinish(attemptId);
  const { attemptResults } = useAttemptResults(attemptId);

  // Answers saved earlier, so a reload doesn't lose progress
  useEffect(() => {
    if (!attemptResults) return;

    setSavedAnswers((prev) => {
      const next = { ...prev };
      for (const result of attemptResults.results) {
        next[result.questionId] = {
          text: result.userAnswer || undefined,
          optionIds: result.userAnswerOptionIds ?? [],
          changes: result.answerChangedCount ?? 0,
        };
      }
      return next;
    });
  }, [attemptResults]);

  const unanswered = questions.filter((q) => !savedAnswers[q.id]);
  const answeredCount = questions.length - unanswered.length;
  const missingIds = highlightedIds.filter((id) => !savedAnswers[id]);

  const handleFinishAttempt = async () => {
    if (unanswered.length > 0) {
      setHighlightedIds(unanswered.map((q) => q.id));
      document
        .getElementById(`question-${unanswered[0].id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    try {
      await finishAttempt();
      router.push(`/materials/${materialId}/attempt/${attemptId}/results`);
    } catch {
      toast({
        title: `❌${t("toasts.attemptNotFinished")}`,
        variant: "error",
      });
    }
  };

  return (
    <BlockColumn blockStyles="gap-4">
      <AttemptHeader materialId={materialId} attemptId={attemptId} />

      {questions.map((item, i) => (
        <AttemptQuestion
          key={item.id}
          questionId={item.id}
          attemptId={attemptId}
          index={i + 1}
          title={item.title}
          questionType={item.questionType}
          options={item.options}
          savedAnswer={savedAnswers[item.id]}
          isMissing={missingIds.includes(item.id)}
          onAnswered={(answer) =>
            setSavedAnswers((prev) => ({ ...prev, [item.id]: answer }))
          }
        />
      ))}

      <div className="sticky bottom-3 z-10 mt-4 flex w-full flex-col gap-3 rounded-2xl border border-neutral-200 bg-white/95 p-3 shadow-lg backdrop-blur sm:flex-row sm:items-center dark:border-neutral-700 dark:bg-neutral-900/95">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="text-sm font-medium">
            {t("attempt.answered", { answered: answeredCount, total: questions.length })}
          </span>
          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
            <div
              className="h-full rounded-full bg-emerald-500 transition-[width] duration-500"
              style={{
                width: `${questions.length ? (answeredCount / questions.length) * 100 : 0}%`,
              }}
            />
          </div>
          {missingIds.length > 0 && (
            <p className="text-sm text-red-500">
              {answeredCount === 0
                ? t("attempt.noneAnswered")
                : t("attempt.left", { count: missingIds.length })}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <IsPendingLoader isPending={finishAttemptIsPending} />
          <Button
            size="lg"
            disabled={finishAttemptIsPending}
            onClick={handleFinishAttempt}
            className={cn(
              "w-full sm:w-44",
              unanswered.length === 0
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-neutral-800 hover:bg-neutral-900",
            )}
          >
            <LuFlag /> {t("attempt.finish")}
          </Button>
        </div>
      </div>
    </BlockColumn>
  );
};
