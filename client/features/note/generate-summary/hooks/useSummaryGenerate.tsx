"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { notesKeys } from "@/entities/note/lib";
import { materialKeys } from "@/entities/material";
import { aiKeys, generateSummary, getAiErrorMessage } from "@/entities/ai";

export const useSummaryGenerate = (materialId: string, noteId: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const generateSummaryMutation = useMutation({
    mutationFn: () => generateSummary(token, materialId, noteId),
    onSuccess: (response) => {
      queryClient.setQueryData(notesKeys.detail(noteId), response.note);
      queryClient.invalidateQueries({ queryKey: notesKeys.all });
      queryClient.invalidateQueries({ queryKey: materialKeys.all });

      toast({
        title: response.isContentTruncated
          ? "✨Summary is ready. The material is very long, so only its first part was used"
          : "✨Summary has been generated!",
        variant: "success",
      });
    },
    onError: (error) => {
      // Quota, AI down or nothing to summarize: tell why, this is not a bug to report
      const aiMessage = getAiErrorMessage(error);
      if (aiMessage) {
        toast({ title: `⚠️${aiMessage}`, variant: "error" });
        return;
      }

      logExceptionError(error, {
        section: `ai/materials/${materialId}/notes/${noteId}/summary (generate)`,
        userID: user?.id,
      });

      toast({
        title: "❌Error occurred while generating summary",
        variant: "error",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: aiKeys.usage() });
    },
  });

  return {
    generateSummary: generateSummaryMutation.mutateAsync,
    generateSummaryIsPending: generateSummaryMutation.isPending,
  };
};
