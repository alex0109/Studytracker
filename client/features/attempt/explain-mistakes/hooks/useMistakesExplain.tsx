"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { attemptKeys, IAttempt } from "@/entities/attempt";
import { aiKeys, explainMistakes, getAiErrorMessage } from "@/entities/ai";

export const useMistakesExplain = (attemptId: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const explainMistakesMutation = useMutation({
    mutationFn: () => explainMistakes(token, attemptId),
    onSuccess: (explanations) => {
      // Explanations are stored on results, so they stay after a reload
      const byResult = new Map(
        explanations.map((item) => [item.resultId, item.explanation]),
      );

      queryClient.setQueryData<IAttempt>(
        attemptKeys.detail(attemptId),
        (attempt) =>
          attempt && {
            ...attempt,
            results: attempt.results.map((result) => ({
              ...result,
              aiExplanation: byResult.get(result.id) ?? result.aiExplanation,
            })),
          },
      );
    },
    onError: (error) => {
      // Quota or AI down: tell why, this is not a bug to report
      const aiMessage = getAiErrorMessage(error);
      if (aiMessage) {
        toast({ title: `⚠️${aiMessage}`, variant: "error" });
        return;
      }

      logExceptionError(error, {
        section: `ai/attempts/${attemptId}/explanations`,
        userID: user?.id,
      });

      toast({
        title: "❌Error occurred while explaining mistakes",
        variant: "error",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: aiKeys.usage() });
    },
  });

  return {
    explainMistakes: explainMistakesMutation.mutate,
    explainMistakesIsPending: explainMistakesMutation.isPending,
  };
};
