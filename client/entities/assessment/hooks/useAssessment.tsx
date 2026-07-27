import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib";
import { getAssessment } from "../api";
import { assessmentKeys } from "../lib/assessment-query-keys";

export const useAssessment = (id: string) => {
  const { token, user } = useSession();

  const assessment = useQuery<string, Error>({
    queryKey: assessmentKeys.detail(id),
    queryFn: () => getAssessment(token, id),
    enabled: !!id && !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (assessment.error) {
      logExceptionError(assessment.error, {
        section: `assessments/${id}`,
        userID: user?.id,
      });
    }
  }, [assessment.error]);

  return {
    assessment: assessment.data,
    assessmentLoading: assessment.isLoading,
    assessmentError: assessment.error,
  };
};
