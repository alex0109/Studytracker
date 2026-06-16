import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session-provider.context";
import { logExceptionError } from "@/shared/lib/utils/exeption.sentry";
import { assessmentKeys } from "../querykeys/assessment.query.keys";
import { getAssessmentResultsService } from "../../services/assessment.service";
import { IResult } from "@/app/types/result/result.type";

const useAssessmentResults = (assessmentId: string) => {
  const { token, user } = useSession();

  const assessmentResults = useQuery<IResult[], Error>({
    queryKey: assessmentKeys.detail(assessmentId),
    queryFn: () => getAssessmentResultsService(token, assessmentId),
    enabled: !!assessmentId && !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (assessmentResults.error) {
      logExceptionError(assessmentResults.error, {
        section: `assessments/${assessmentId}/results`,
        userID: user?.id,
      });
    }
  }, [assessmentResults.error]);

  return {
    assessmentResults: assessmentResults.data,
    assessmentResultsLoading: assessmentResults.isLoading,
    assessmentResultsError: assessmentResults.error,
  };
};

export default useAssessmentResults;
