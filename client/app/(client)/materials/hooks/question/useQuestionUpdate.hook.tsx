import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session-provider.context";
import { logExceptionError } from "@/shared/lib/utils/exeption.sentry";
import { updateQuestionService } from "../../services/question.service";
import { questionKeys } from "../querykeys/question.query.keys";
import { IQuestion } from "@/app/types/question/question.type";

const useQuestionUpdate = (materialId: string, id: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const updateQuestionMutation = useMutation({
    mutationFn: ({ dataToUpdate }: { dataToUpdate: Partial<IQuestion> }) =>
      updateQuestionService(token, materialId, id, dataToUpdate),
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
    },
  });

  return {
    updateQuestion: updateQuestionMutation.mutate,
  };
};

export default useQuestionUpdate;
