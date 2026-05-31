import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { useSession } from "@/shared/context/session-provider.context";

import { logExceptionError } from "@/shared/lib/utils/exeption.sentry";
import { IAssessment } from "@/app/types/assessment/assessment.type";
import { getAllAssessmentsService } from "../../services/assessment.service";
import { assessmentKeys } from "../querykeys/assessment.query.keys";

const useAssessmentAll = (materialId: string) => {
  const { token, user } = useSession();

  const assessments = useQuery<IAssessment[], Error>({
    queryKey: assessmentKeys.list(materialId),
    queryFn: () => {
      return getAllAssessmentsService(token, materialId);
    },
    enabled: !!materialId && !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (assessments.error) {
      logExceptionError(assessments.error, {
        section: `materials/${materialId}/assessments`,
        userID: user?.id,
      });
    }
  }, [assessments.error]);

  return {
    assessmentsData: assessments.data,
    assessmentsLoading: assessments.isLoading,
    assessmentsError: assessments.error,
  };
};

export default useAssessmentAll;
