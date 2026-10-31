"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { finishFlashcardSession, flashcardKeys } from "@/entities/flashcard";
import { dictionaryKeys } from "@/entities/dictionary";
import { statisticsKeys } from "@/entities/statistics";
import { notificationKeys } from "@/entities/notification";
import { reviewKeys } from "@/entities/review";

// No dictionary: a "Today" session, its words came from any dictionary
export const useFlashcardSessionFinish = (dictionaryId?: string | null) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const finishSessionMutation = useMutation({
    mutationFn: (sessionId: string) => finishFlashcardSession(token, sessionId),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: dictionaryId ? flashcardKeys.stats(dictionaryId) : flashcardKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: dictionaryId ? dictionaryKeys.detail(dictionaryId) : dictionaryKeys.details(),
      });
      queryClient.invalidateQueries({ queryKey: reviewKeys.today() });
      // Reviewed cards count for the streak and the due words of today
      queryClient.invalidateQueries({ queryKey: statisticsKeys.studyStreak() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.feed() });
    },
    onError: (error, sessionId) => {
      logExceptionError(error, {
        section: `dictionaries/flashcards/sessions/${sessionId}/finish`,
        userID: user?.id,
      });

      toast({
        title: `❌${t("toasts.flashcardsFinishError")}`,
        variant: "error",
      });
    },
  });

  return {
    finishSession: finishSessionMutation.mutate,
  };
};
