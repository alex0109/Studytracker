"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context";
import { logExceptionError } from "@/shared/lib";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { IResultRequest, submitAnswer, attemptKeys } from "@/entities/attempt";

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
