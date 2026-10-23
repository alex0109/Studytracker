"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { flashcardKeys, resetEntryProgress } from "@/entities/flashcard";
import { dictionaryKeys } from "@/entities/dictionary";

export const useEntryProgressReset = (dictionaryId: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const resetProgressMutation = useMutation({
    mutationFn: (entryId: string) => resetEntryProgress(token, entryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dictionaryKeys.detail(dictionaryId),
      });
      queryClient.invalidateQueries({
        queryKey: flashcardKeys.stats(dictionaryId),
      });

      toast({
        title: "✅Word progress has been reset",
        variant: "success",
      });
    },
    onError: (error, entryId) => {
      logExceptionError(error, {
        section: `dictionaries/entries/${entryId}/progress/reset`,
        userID: user?.id,
      });

      toast({
        title: "❌Error occurred while resetting progress",
        variant: "error",
      });
    },
  });

  return {
    resetProgress: resetProgressMutation.mutate,
    resetProgressIsPending: resetProgressMutation.isPending,
  };
};
