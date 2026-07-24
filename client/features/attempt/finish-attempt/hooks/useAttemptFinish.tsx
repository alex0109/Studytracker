"use client";

import { useMutation } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { finishAttempt } from "@/entities/attempt";

export const useAttemptFinish = (attemptId: string) => {
  const { token, user } = useSession();

  const finishAttemptMutation = useMutation({
    mutationFn: () => finishAttempt(token, attemptId),
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
