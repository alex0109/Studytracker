"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { rescheduleReviews } from "@/entities/profile";
import { reviewKeys } from "@/entities/review";
import { flashcardKeys } from "@/entities/flashcard";
import { questionKeys } from "@/entities/question";

// After a new retention: due dates of all words and questions are counted again from their history
export const useReschedule = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const mutation = useMutation({
    mutationFn: () => rescheduleReviews(token),
    onSuccess: ({ words, questions }) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      queryClient.invalidateQueries({ queryKey: flashcardKeys.all });
      queryClient.invalidateQueries({ queryKey: questionKeys.all });
      toast({ title: `✅${t("learning.rescheduled", { count: words + questions })}`, variant: "success" });
    },
    onError: (error) => {
      logExceptionError(error, { section: "profile/reschedule", userID: user?.id });
      toast({ title: `❌${t("learning.rescheduleError")}`, variant: "error" });
    },
  });

  return { reschedule: mutation.mutate, rescheduleIsPending: mutation.isPending };
};
