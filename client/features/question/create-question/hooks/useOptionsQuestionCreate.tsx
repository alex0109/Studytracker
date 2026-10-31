"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { getLimitErrorMessage } from "@/shared/lib/limits";
import {
  questionKeys,
  createOptionsQuestion,
  IOptionsQuestionRequest,
} from "@/entities/question";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";

export const useOptionsQuestionCreate = (
  materialId: string,
  noteId?: string,
) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const createOptionsQuestionMutation = useMutation({
    mutationFn: (body: IOptionsQuestionRequest) => {
      return createOptionsQuestion(token, materialId, body, noteId);
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: questionKeys.list(materialId),
      });

      toast({
        title: `✅${t("toasts.questionCreated")}`,
        variant: "success",
      });
    },
    onError: (error) => {
      // Limit reached: show why and refresh the counter, this is not a bug to report
      const limitMessage = getLimitErrorMessage(error, t);
      if (limitMessage) {
        queryClient.invalidateQueries({ queryKey: questionKeys.list(materialId) });
        toast({ title: `⚠️${limitMessage}`, variant: "error" });
        return;
      }

      logExceptionError(error, {
        section: `materials/${materialId}/questions/options (create)`,
        userID: user?.id,
      });

      toast({
        title: `❌${t("toasts.questionCreateError")}`,
        variant: "error",
      });
    },
  });

  return {
    createOptionsQuestion: createOptionsQuestionMutation.mutate,
    createOptionsQuestionIsPending: createOptionsQuestionMutation.isPending,
  };
};
