"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { IResultRequest } from "@/entities/attempt/model";
import { submitAnswer } from "@/entities/attempt/api";
import { attemptKeys } from "@/entities/attempt/lib/attempt-query-keys";

export const useAttemptSubmitAnswer = (attemptId: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const submitAnswerMutation = useMutation({
    mutationFn: (body: Partial<IResultRequest>) =>
      submitAnswer(token, attemptId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: attemptKeys.detail(attemptId),
      });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `attempts/${attemptId}/submit (create)`,
        userID: user?.id,
      });

      toast({
        title: `❌${t("toasts.answerNotSavedRetry")}`,
        variant: "error",
      });
    },
  });

  return {
    submitAnswer: submitAnswerMutation.mutateAsync,
    submitAnswerIsPending: submitAnswerMutation.isPending,
  };
};
