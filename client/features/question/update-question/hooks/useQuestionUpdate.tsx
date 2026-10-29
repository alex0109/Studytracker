"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import {
  IQuestionUpdate,
  questionKeys,
  updateQuestion,
} from "@/entities/question";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";

export const useQuestionUpdate = (materialId: string, id: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const updateQuestionMutation = useMutation({
    mutationFn: ({ dataToUpdate }: { dataToUpdate: IQuestionUpdate }) =>
      updateQuestion(token, materialId, id, dataToUpdate),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: questionKeys.detail(materialId, id),
      });
      queryClient.invalidateQueries({
        queryKey: questionKeys.list(materialId),
      });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `materials/${materialId}/questions/${id} (update)`,
        userID: user?.id,
      });

      toast({
        title: `❌${t("toasts.questionUpdateError")}`,
        variant: "error",
      });
    },
  });

  return {
    updateQuestion: updateQuestionMutation.mutate,
    updateQuestionIsPending: updateQuestionMutation.isPending,
  };
};
