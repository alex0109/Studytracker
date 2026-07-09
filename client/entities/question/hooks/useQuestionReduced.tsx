import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { IQuestionReduced, questionKeys } from "../model";
import { getAllQuestions } from "../api";

export const useQuestionReduced = (materialId: string) => {
  const { token, user } = useSession();

  const questionsReduced = useQuery<IQuestionReduced[], Error>({
    queryKey: questionKeys.list(materialId),
    queryFn: () => {
      return getAllQuestions(token, materialId);
    },
    enabled: !!materialId && !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (questionsReduced.error) {
      logExceptionError(questionsReduced.error, {
        section: `materials/${materialId}/questions/assessment`,
        userID: user?.id,
      });
    }
  }, [questionsReduced.error]);

  return {
    questionsReducedData: questionsReduced.data,
    questionsReducedLoading: questionsReduced.isLoading,
    questionsReducedError: questionsReduced.error,
  };
};
