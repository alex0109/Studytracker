import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session-provider.context";
import { logExceptionError } from "@/shared/lib/utils/exeption.sentry";
import { submitAnswerService } from "../../services/assessment.service";
import { assessmentKeys } from "../querykeys/assessment.query.keys";
import { IResult } from "@/app/types/result/result.type";

const useAssessmentSubmitAnswer = (assessmentId: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const submitAnswerMutation = useMutation({
    mutationFn: (body: Partial<IResult>) =>
      submitAnswerService(token, assessmentId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: assessmentKeys.detail(assessmentId),
      });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `assessment/${assessmentId}/submit (create)`,
        userID: user?.id,
      });
    },
  });

  return {
    submitAnswer: submitAnswerMutation.mutate,
  };
};

export default useAssessmentSubmitAnswer;
