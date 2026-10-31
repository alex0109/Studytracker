"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { finishAttempt } from "@/entities/attempt";
import { statisticsKeys } from "@/entities/statistics";
import { notificationKeys } from "@/entities/notification";

export const useAttemptFinish = (attemptId: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const finishAttemptMutation = useMutation({
    mutationFn: () => finishAttempt(token, attemptId),
    onSuccess: () => {
      // Scores, streak and "today" all change after a finished attempt
      queryClient.invalidateQueries({ queryKey: statisticsKeys.all });
      queryClient.invalidateQueries({ queryKey: notificationKeys.feed() });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `attempts/${attemptId}/finish (update)`,
        userID: user?.id,
      });
    },
  });

  return {
    finishAttempt: finishAttemptMutation.mutateAsync,
    finishAttemptIsPending: finishAttemptMutation.isPending,
  };
};
