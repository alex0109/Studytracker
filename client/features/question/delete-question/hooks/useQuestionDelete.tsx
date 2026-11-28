"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context";
import { logExceptionError } from "@/shared/lib";
import { questionKeys, deleteQuestion } from "@/entities/question";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { reviewKeys } from "@/entities/review";

export const useQuestionDelete = (materialId: string, id?: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const deleteQuestionMutation = useMutation({
    mutationFn: (id: string) => deleteQuestion(token, materialId, id),
    onSuccess: () => {
      // What "Today" waits for changed: its queue, the reminder and the count in the menu
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
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
