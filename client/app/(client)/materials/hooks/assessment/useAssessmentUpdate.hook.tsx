import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session-provider.context";
import { logExceptionError } from "@/shared/lib/utils/exeption.sentry";
import { IMaterial } from "@/app/types/material/material.type";
import { updateAssessmentService } from "../../services/assessment.service";
import { assessmentKeys } from "../querykeys/assessment.query.keys";

const useAssessmentUpdate = (materialId: string, id: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const updateAssessmentMutation = useMutation({
    mutationFn: ({
      dataToUpdate,
    }: {
      id: string;
      dataToUpdate: Partial<IMaterial>;
    }) => updateAssessmentService(token, materialId, id, dataToUpdate),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: assessmentKeys.detail(materialId, id),
      });
      queryClient.invalidateQueries({
        queryKey: assessmentKeys.list(materialId),
      });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `materials/${materialId}/assessments/${id} (update)`,
        userID: user?.id,
      });
    },
  });

  return {
    updateAssessment: updateAssessmentMutation.mutate,
  };
};

export default useAssessmentUpdate;
