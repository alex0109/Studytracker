"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { attemptKeys, startAttempt } from "@/entities/attempt";

export const useAttemptStart = (assessmentId: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const startAttemptMutation = useMutation({
    mutationFn: () => startAttempt(token, assessmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attemptKeys.all });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: "attempts/ (create)",
        userID: user?.id,
      });
    },
  });

  return {
    attemptStart: startAttemptMutation.mutateAsync,
    startAttemptPending: startAttemptMutation.isPending,
  };
};
