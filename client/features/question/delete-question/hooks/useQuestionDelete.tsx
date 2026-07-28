"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { questionKeys, deleteQuestion } from "@/entities/question";
import { toast } from "@/shared/radix-ui";

export const useQuestionDelete = (materialId: string, id?: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const deleteQuestionMutation = useMutation({
    mutationFn: (id: string) => deleteQuestion(token, materialId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: questionKeys.list(materialId),
      });

      toast({
        title: "✅Question successfully deleted",
        variant: "success",
      });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `materials/${materialId}/questions/${id} (delete)`,
        userID: user?.id,
      });

      toast({
        title: "❌Error occured while deleting question",
        variant: "error",
      });
    },
  });

  return {
    deleteQuestion: deleteQuestionMutation.mutate,
  };
};
