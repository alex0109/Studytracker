import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useSession } from "@/shared/context/session-provider.context";

import { logExceptionError } from "@/shared/lib/utils/exeption.sentry";
import { deleteAssessmentService } from "../../services/assessment.service";
import { assessmentKeys } from "../querykeys/assessment.query.keys";

const useAssessmentDelete = (materialId: string, id: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const deleteAssessmentMutation = useMutation({
    mutationFn: () => deleteAssessmentService(token, materialId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: assessmentKeys.list(materialId),
      });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `materials/${materialId}/assessments/${id} (delete)`,
        userID: user?.id,
      });
    },
  });

  return {
    deleteAssessment: deleteAssessmentMutation.mutate,
  };
};

export default useAssessmentDelete;
