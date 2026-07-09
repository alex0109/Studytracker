import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { attemptKeys, IResult } from "../model";
import { submitAnswer } from "../api";

export const useAttemptSubmitAnswer = (attemptId: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const submitAnswerMutation = useMutation({
    mutationFn: (body: Partial<IResult>) =>
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
    },
  });

  return {
    submitAnswer: submitAnswerMutation.mutate,
  };
};
