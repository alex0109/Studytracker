"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { questionKeys } from "@/entities/question";
import {
  aiKeys,
  generateQuestions,
  getAiErrorMessage,
  IQuestionGenerate,
} from "@/entities/ai";

export const useQuestionsGenerate = (materialId: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const generateQuestionsMutation = useMutation({
    mutationFn: (body: IQuestionGenerate) =>
      generateQuestions(token, materialId, body),
    onSuccess: (questions) => {
      queryClient.invalidateQueries({
        queryKey: questionKeys.list(materialId),
      });

      toast({
        title: `✨${t("toasts.questionsGenerated", { count: questions.length })}`,
        variant: "success",
      });
    },
    onError: (error) => {
      // Quota, AI down or nothing to generate from: tell why, this is not a bug to report
      const aiMessage = getAiErrorMessage(error, t);
      if (aiMessage) {
        queryClient.invalidateQueries({
          queryKey: questionKeys.list(materialId),
        });
        toast({ title: `⚠️${aiMessage}`, variant: "error" });
        return;
      }

      logExceptionError(error, {
        section: `ai/materials/${materialId}/questions (generate)`,
        userID: user?.id,
      });

      toast({
        title: `❌${t("toasts.questionsGenerateError")}`,
        variant: "error",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: aiKeys.usage() });
    },
  });

  return {
    generateQuestions: generateQuestionsMutation.mutateAsync,
    generateQuestionsIsPending: generateQuestionsMutation.isPending,
  };
};
