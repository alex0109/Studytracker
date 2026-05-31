import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session-provider.context";
import { logExceptionError } from "@/shared/lib/utils/exeption.sentry";
import { assessmentKeys } from "../querykeys/assessment.query.keys";
import { createAssessmentService } from "../../services/assessment.service";
import { IAssessment } from "@/app/types/assessment/assessment.type";
import { TUpdateAssessment } from "@/app/types/assessment/assessment.update.type";

const useAssessmentCreate = (materialId: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const createAssessmentMutation = useMutation({
    mutationFn: (body: TUpdateAssessment) => {
      console.log("fetch");
      return createAssessmentService(token, materialId, body);
    },
    onSuccess: () => {
      console.log("invalidate");
      queryClient.refetchQueries({
        queryKey: assessmentKeys.list(materialId),
      });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `materials/${materialId}/assessments (create)`,
        userID: user?.id,
      });
    },
  });

  return {
    createAssessment: createAssessmentMutation.mutate,
  };
};

export default useAssessmentCreate;
