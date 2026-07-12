import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { startAssessment } from "@/entities/assessment";
import { assessmentKeys } from "@/entities/assessment/lib/assessment-query-keys";

export const useStartAssessment = (id: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const startAssessmentMutation = useMutation({
    mutationFn: () => startAssessment(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assessmentKeys.all });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `assessments/${id}/start (create)`,
        userID: user?.id,
      });
    },
  });

  return {
    startAssessment: startAssessmentMutation.mutate,
  };
};
