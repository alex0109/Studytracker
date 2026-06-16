import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session-provider.context";
import { logExceptionError } from "@/shared/lib/utils/exeption.sentry";
import { startAssessmentService } from "../../services/assessment.service";
import { assessmentKeys } from "../querykeys/assessment.query.keys";

const useAssessmentStart = (materialId: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const startAssessmentMutation = useMutation({
    mutationFn: () => startAssessmentService(token, materialId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assessmentKeys.all });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: "assessment/ (create)",
        userID: user?.id,
      });
    },
  });

  return {
    startAssessment: startAssessmentMutation.mutateAsync,
    startAssessmentPending: startAssessmentMutation.isPending,
  };
};

export default useAssessmentStart;
