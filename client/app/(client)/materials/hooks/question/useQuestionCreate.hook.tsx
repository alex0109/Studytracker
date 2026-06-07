import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session-provider.context";
import { logExceptionError } from "@/shared/lib/utils/exeption.sentry";
import { questionKeys } from "../querykeys/question.query.keys";
import { createQuestionService } from "../../services/question.service";
import { IQuestion } from "@/app/types/question/question.type";

const useQuestionCreate = (materialId: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const createQuestionMutation = useMutation({
    mutationFn: (body: Partial<IQuestion>) => {
      console.log("fetch");
      return createQuestionService(token, materialId, body);
    },
    onSuccess: () => {
      console.log("invalidate");
      queryClient.refetchQueries({
        queryKey: questionKeys.list(materialId),
      });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `materials/${materialId}/questions (create)`,
        userID: user?.id,
      });
    },
  });

  return {
    createQuestion: createQuestionMutation.mutate,
  };
};

export default useQuestionCreate;
