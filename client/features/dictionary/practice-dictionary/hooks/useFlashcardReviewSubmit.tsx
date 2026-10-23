"use client";

import { useMutation } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import {
  IFlashcardReviewCreate,
  submitFlashcardReview,
} from "@/entities/flashcard";

export const useFlashcardReviewSubmit = (sessionId: string) => {
  const { token, user } = useSession();

  const submitReviewMutation = useMutation({
    mutationFn: (body: IFlashcardReviewCreate) =>
      submitFlashcardReview(token, sessionId, body),
    // Review id is generated on the client, so retries are safe
    retry: 2,
    onError: (error) => {
      logExceptionError(error, {
        section: `dictionaries/flashcards/sessions/${sessionId}/reviews (create)`,
        userID: user?.id,
      });

      toast({
        title: "❌Answer was not saved",
        variant: "error",
      });
    },
  });

  return {
    submitReview: submitReviewMutation.mutateAsync,
  };
};
