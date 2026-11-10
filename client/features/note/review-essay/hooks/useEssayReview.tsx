"use client";

import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { notesKeys } from "@/entities/note";
import { aiKeys, getAiErrorMessage, reviewEssay } from "@/entities/ai";

const SAVE_WAIT_STEP_MS = 100;
const SAVE_WAIT_LIMIT_MS = 8000;

// The check reads the saved text: the last words typed are still on their way while a save runs
const waitForSaves = async (queryClient: QueryClient, noteId: string) => {
  const started = Date.now();
  while (
    queryClient.isMutating({ mutationKey: notesKeys.update(noteId) }) > 0 &&
    Date.now() - started < SAVE_WAIT_LIMIT_MS
  ) {
    await new Promise((resolve) => setTimeout(resolve, SAVE_WAIT_STEP_MS));
  }
};

export const useEssayReview = (materialId: string, noteId: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const reviewMutation = useMutation({
    mutationFn: async () => {
      await waitForSaves(queryClient, noteId);
      return reviewEssay(token, materialId, noteId);
    },
    onSuccess: (response) => {
      queryClient.setQueryData(notesKeys.detail(noteId), response.note);
      toast({ title: `✨${t("toasts.essayChecked")}`, variant: "success" });
    },
    onError: (error) => {
      // Quota, AI down or a text too short: tell why, this is not a bug to report
      const aiMessage = getAiErrorMessage(error, t);
      if (aiMessage) {
        toast({ title: `⚠️${aiMessage}`, variant: "error" });
        return;
      }

      logExceptionError(error, {
        section: `ai/materials/${materialId}/notes/${noteId}/essay-review`,
        userID: user?.id,
      });
      toast({ title: `❌${t("toasts.essayCheckError")}`, variant: "error" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: aiKeys.usage() });
    },
  });

  return {
    reviewEssay: reviewMutation.mutate,
    reviewEssayIsPending: reviewMutation.isPending,
  };
};
