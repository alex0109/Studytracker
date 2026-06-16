import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session-provider.context";
import { logExceptionError } from "@/shared/lib/utils/exeption.sentry";
import { assessmentKeys } from "../querykeys/assessment.query.keys";
import { finishAssessmentService } from "../../services/assessment.service";

const useAssessmentFinish = (assessmentId: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const finishAssessmentMutation = useMutation({
    mutationFn: () => finishAssessmentService(token, assessmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: assessmentKeys.detail(assessmentId),
      });
      queryClient.invalidateQueries({ queryKey: assessmentKeys.all });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `assessment/${assessmentId}/finish (update)`,
        userID: user?.id,
      });
    },
  });

  return {
    finishAssessment: finishAssessmentMutation.mutate,
  };
};

export default useAssessmentFinish;
