import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useSession } from "@/shared/context/session-provider.context";

import { logExceptionError } from "@/shared/lib/utils/exeption.sentry";
import { deleteQuestionService } from "../../services/question.service";
import { questionKeys } from "../querykeys/question.query.keys";

const useQuestionDelete = (materialId: string, id?: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const deleteQuestionMutation = useMutation({
    mutationFn: (id: string) => deleteQuestionService(token, materialId, id),
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

export default useQuestionDelete;
