"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { questionKeys, deleteQuestion } from "@/entities/question";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";

export const useQuestionDelete = (materialId: string, id?: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const deleteQuestionMutation = useMutation({
    mutationFn: (id: string) => deleteQuestion(token, materialId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: questionKeys.list(materialId),
      });

      toast({
        title: `✅${t("toasts.questionDeleted")}`,
        variant: "success",
      });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `materials/${materialId}/questions/${id} (delete)`,
        userID: user?.id,
      });

      toast({
        title: `❌${t("toasts.questionDeleteError")}`,
        variant: "error",
      });
    },
  });

  return {
    deleteQuestion: deleteQuestionMutation.mutate,
  };
};
