"use client";

import { isAxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import type { IFlashcardSessionCreate } from "@/entities/flashcard";
import type { IResultRequest } from "@/entities/attempt";
import { questionKeys } from "@/entities/question";
import { statisticsKeys } from "@/entities/statistics";
import { notificationKeys } from "@/entities/notification";
import {
  answerReviewQuestion,
  finishQuestionReview,
  reviewKeys,
  startQuestionReview,
  startTodayWords,
} from "@/entities/review";
import { trackEvent } from "@/shared/lib/analytics";

// 409 means the queue emptied in the meantime: not a bug, just nothing to review
const isEmptyQueue = (error: unknown) => isAxiosError(error) && error.response?.status === 409;

export const useTodayWordsStart = () => {
  const { t } = useTranslation();
  const { token, user } = useSession();

  const mutation = useMutation({
    mutationFn: (body: IFlashcardSessionCreate) => startTodayWords(token, body),
    onSuccess: () => trackEvent("start_today_review"),
    onError: (error) => {
      if (isEmptyQueue(error)) {
        toast({ title: `🤷${t("toasts.noCards")}`, variant: "error" });
        return;
      }
      logExceptionError(error, { section: "review/today/words (start)", userID: user?.id });
      toast({ title: `❌${t("toasts.flashcardsStartError")}`, variant: "error" });
    },
  });

  return { startWords: mutation.mutate, startWordsIsPending: mutation.isPending };
};

export const useQuestionReviewStart = () => {
  const { t } = useTranslation();
  const { token, user } = useSession();

  const mutation = useMutation({
    mutationFn: () => startQuestionReview(token),
    onError: (error) => {
      if (isEmptyQueue(error)) {
        toast({ title: `🤷${t("toasts.noQuestions")}`, variant: "error" });
        return;
      }
      logExceptionError(error, { section: "review/today/questions (start)", userID: user?.id });
      toast({ title: `❌${t("errors.generic")}`, variant: "error" });
    },
  });

  return { startQuestions: mutation.mutate, startQuestionsIsPending: mutation.isPending };
};

export const useReviewAnswer = (sessionId: string) => {
  const { t } = useTranslation();
  const { token, user } = useSession();

  const mutation = useMutation({
    mutationFn: (body: IResultRequest) => answerReviewQuestion(token, sessionId, body),
    onError: (error) => {
      logExceptionError(error, { section: `review/sessions/${sessionId}/answer`, userID: user?.id });
      toast({ title: `❌${t("errors.generic")}`, variant: "error" });
    },
  });

  return { submitAnswer: mutation.mutateAsync, submitAnswerIsPending: mutation.isPending };
};

// Answers are saved one by one, finishing only closes the session and refreshes the numbers
export const useQuestionReviewFinish = () => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const mutation = useMutation({
    mutationFn: (sessionId: string) => finishQuestionReview(token, sessionId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.today() });
      queryClient.invalidateQueries({ queryKey: questionKeys.all });
      queryClient.invalidateQueries({ queryKey: statisticsKeys.studyStreak() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.feed() });
    },
    onError: (error, sessionId) => {
      logExceptionError(error, { section: `review/sessions/${sessionId}/finish`, userID: user?.id });
    },
  });

  return { finishQuestions: mutation.mutate };
};
