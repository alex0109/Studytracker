"use client";

import { isAxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import {
  IFlashcardSessionCreate,
  startFlashcardSession,
} from "@/entities/flashcard";

export const useFlashcardSessionStart = (dictionaryId: string) => {
  const { t } = useTranslation();
  const { token, user } = useSession();

  const startSessionMutation = useMutation({
    mutationFn: (body: IFlashcardSessionCreate) =>
      startFlashcardSession(token, dictionaryId, body),
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 409) {
        toast({
          title: `🤷${t("toasts.noCards")}`,
          variant: "error",
        });
        return;
      }

      logExceptionError(error, {
        section: `dictionaries/${dictionaryId}/flashcards/sessions (start)`,
        userID: user?.id,
      });

      toast({
        title: `❌${t("toasts.flashcardsStartError")}`,
        variant: "error",
      });
    },
  });

  return {
    startSession: startSessionMutation.mutate,
    startSessionIsPending: startSessionMutation.isPending,
  };
};
