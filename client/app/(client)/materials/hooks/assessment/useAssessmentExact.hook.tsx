import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { useSession } from "@/shared/context/session-provider.context";

import { logExceptionError } from "@/shared/lib/utils/exeption.sentry";
import { IAssessment } from "@/app/types/assessment/assessment.type";
import { getOneAssessmentService } from "../../services/assessment.service";
import { assessmentKeys } from "../querykeys/assessment.query.keys";

const useAssessmentExact = (materialId: string, id: string) => {
  const { token, user } = useSession();

  const assessmentExact = useQuery<IAssessment, Error>({
    queryKey: assessmentKeys.detail(materialId, id),
    queryFn: ({ queryKey }) => {
      return getOneAssessmentService(
        token,
        queryKey[1] as string,
        queryKey[2] as string,
      );
    },
    enabled: !!materialId && !!id && !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (assessmentExact.error) {
      logExceptionError(assessmentExact.error, {
        section: `materials/${materialId}/assessments/${id}`,
        userID: user?.id,
      });
    }
  }, [assessmentExact.error]);

  return {
    assessmentExact: assessmentExact.data,
    assessmentExactLoading: assessmentExact.isLoading,
    assessmentExactError: assessmentExact.error,
  };
};

export default useAssessmentExact;
