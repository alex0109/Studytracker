import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { questionKeys, deleteQuestion } from "@/entities/question";

export const useQuestionDelete = (materialId: string, id?: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const deleteQuestionMutation = useMutation({
    mutationFn: (id: string) => deleteQuestion(token, materialId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: questionKeys.list(materialId),
      });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `materials/${materialId}/questions/${id} (delete)`,
        userID: user?.id,
      });
    },
  });

  return {
    deleteQuestion: deleteQuestionMutation.mutate,
  };
};
