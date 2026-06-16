import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session-provider.context";
import { logExceptionError } from "@/shared/lib/utils/exeption.sentry";
import { assessmentKeys } from "../querykeys/assessment.query.keys";
import { getAssessmentService } from "../../services/assessment.service";
import { IAssessment } from "@/app/types/assessment/assessment.type";

const useAssessmentExact = (assessmentId: string) => {
  const { token, user } = useSession();

  const exactAssessment = useQuery<IAssessment, Error>({
    queryKey: assessmentKeys.detail(assessmentId),
    queryFn: () => getAssessmentService(token, assessmentId),
    enabled: !!assessmentId && !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (exactAssessment.error) {
      logExceptionError(exactAssessment.error, {
        section: `assessments/${assessmentId}`,
        userID: user?.id,
      });
    }
  }, [exactAssessment.error]);

  return {
    exactAssessment: exactAssessment.data,
    exactAssessmentLoading: exactAssessment.isLoading,
    exactAssessmentError: exactAssessment.error,
  };
};

export default useAssessmentExact;
