import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { IQuestionResponse, questionKeys } from "../model";
import { getAllQuestions } from "../api";

export const useQuestionAll = (materialId: string) => {
  const { token, user } = useSession();

  const questions = useQuery<IQuestionResponse[], Error>({
    queryKey: questionKeys.list(materialId),
    queryFn: () => {
      return getAllQuestions(token, materialId);
    },
    enabled: !!materialId && !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (questions.error) {
      logExceptionError(questions.error, {
        section: `materials/${materialId}/questions`,
        userID: user?.id,
      });
    }
  }, [questions.error]);

  return {
    questionsData: questions.data,
    questionsLoading: questions.isLoading,
    questionsError: questions.error,
  };
};
