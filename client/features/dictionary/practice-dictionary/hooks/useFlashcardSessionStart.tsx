"use client";

import { isAxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import {
  IFlashcardSessionCreate,
  startFlashcardSession,
} from "@/entities/flashcard";

export const useFlashcardSessionStart = (dictionaryId: string) => {
  const { token, user } = useSession();

  const startSessionMutation = useMutation({
    mutationFn: (body: IFlashcardSessionCreate) =>
      startFlashcardSession(token, dictionaryId, body),
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 409) {
        toast({
          title: "🤷There are no cards to review right now",
          variant: "error",
        });
        return;
      }

      logExceptionError(error, {
        section: `dictionaries/${dictionaryId}/flashcards/sessions (start)`,
        userID: user?.id,
      });

      toast({
        title: "❌Error occurred while starting flashcards",
        variant: "error",
      });
    },
  });

  return {
    startSession: startSessionMutation.mutate,
    startSessionIsPending: startSessionMutation.isPending,
  };
};
