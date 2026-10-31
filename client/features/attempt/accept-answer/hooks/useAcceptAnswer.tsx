"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { acceptAnswer, attemptKeys, IAttempt, undoAcceptAnswer } from "@/entities/attempt";
import { statisticsKeys } from "@/entities/statistics";
import { questionKeys } from "@/entities/question";
import { reviewKeys } from "@/entities/review";

// Accepting changes the grade, the score of the attempt, statistics and when the question returns
export const useAcceptAnswer = (attemptId: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const refresh = (attempt: IAttempt) => {
    queryClient.setQueryData(attemptKeys.detail(attemptId), attempt);
    queryClient.invalidateQueries({ queryKey: statisticsKeys.all });
    queryClient.invalidateQueries({ queryKey: questionKeys.all });
    queryClient.invalidateQueries({ queryKey: reviewKeys.today() });
  };

  const undo = useMutation({
    mutationFn: (resultId: string) => undoAcceptAnswer(token, attemptId, resultId),
    onSuccess: (attempt) => {
      refresh(attempt);
      toast({ title: t("results.undone") });
    },
    onError: (error) => {
      logExceptionError(error, { section: `attempts/${attemptId}/accept (undo)`, userID: user?.id });
      toast({ title: `❌${t("results.undoError")}`, variant: "error" });
    },
  });

  const accept = useMutation({
    mutationFn: (resultId: string) => acceptAnswer(token, attemptId, resultId),
    onSuccess: (attempt, resultId) => {
      refresh(attempt);
      toast({
        title: `✅${t("results.acceptedToast")}`,
        variant: "success",
        durationMs: 8000,
        action: { label: t("results.undo"), onClick: () => undo.mutate(resultId) },
      });
    },
    onError: (error) => {
      logExceptionError(error, { section: `attempts/${attemptId}/accept`, userID: user?.id });
      toast({ title: `❌${t("results.acceptError")}`, variant: "error" });
    },
  });

  return { acceptAnswer: accept.mutate, acceptAnswerIsPending: accept.isPending };
};
