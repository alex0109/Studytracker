"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { finishFlashcardSession, flashcardKeys } from "@/entities/flashcard";
import { dictionaryKeys } from "@/entities/dictionary";

export const useFlashcardSessionFinish = (dictionaryId: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const finishSessionMutation = useMutation({
    mutationFn: (sessionId: string) => finishFlashcardSession(token, sessionId),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: flashcardKeys.stats(dictionaryId),
      });
      queryClient.invalidateQueries({
        queryKey: dictionaryKeys.detail(dictionaryId),
      });
    },
    onError: (error, sessionId) => {
      logExceptionError(error, {
        section: `dictionaries/flashcards/sessions/${sessionId}/finish`,
        userID: user?.id,
      });

      toast({
        title: "❌Error occurred while finishing flashcards",
        variant: "error",
      });
    },
  });

  return {
    finishSession: finishSessionMutation.mutate,
  };
};
