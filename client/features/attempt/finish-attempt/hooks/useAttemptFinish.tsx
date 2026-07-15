"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { attemptKeys, finishAttempt } from "@/entities/attempt";

export const useAttemptFinish = (attemptId: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const finishAttemptMutation = useMutation({
    mutationFn: () => finishAttempt(token, attemptId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: attemptKeys.detail(attemptId),
      });
      queryClient.invalidateQueries({ queryKey: attemptKeys.all });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `attempts/${attemptId}/finish (update)`,
        userID: user?.id,
      });
    },
  });

  return {
    finishAttempt: finishAttemptMutation.mutate,
  };
};
