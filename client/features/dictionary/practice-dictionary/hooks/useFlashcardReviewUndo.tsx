"use client";

import { useMutation } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { undoFlashcardReview } from "@/entities/flashcard";

export const useFlashcardReviewUndo = (sessionId: string) => {
  const { t } = useTranslation();
  const { token, user } = useSession();

  const undoReviewMutation = useMutation({
    mutationFn: (reviewId: string) =>
      undoFlashcardReview(token, sessionId, reviewId),
    onError: (error, reviewId) => {
      logExceptionError(error, {
        section: `dictionaries/flashcards/sessions/${sessionId}/reviews/${reviewId} (delete)`,
        userID: user?.id,
      });

      toast({
        title: `❌${t("toasts.undoError")}`,
        variant: "error",
      });
    },
  });

  return {
    undoReview: undoReviewMutation.mutateAsync,
  };
};
