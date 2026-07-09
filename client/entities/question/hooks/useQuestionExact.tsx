import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { IQuestionResponse, questionKeys } from "../model";
import { getQuestion } from "../api";

export const useQuestionExact = (materialId: string, id: string) => {
  const { token, user } = useSession();

  const questionExact = useQuery<IQuestionResponse, Error>({
    queryKey: questionKeys.detail(materialId, id),
    queryFn: ({ queryKey }) => {
      return getQuestion(token, queryKey[1] as string, queryKey[2] as string);
    },
    enabled: !!materialId && !!id && !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (questionExact.error) {
      logExceptionError(questionExact.error, {
        section: `materials/${materialId}/questions/${id}`,
        userID: user?.id,
      });
    }
  }, [questionExact.error]);

  return {
    questionExact: questionExact.data,
    questionExactLoading: questionExact.isLoading,
    questionExactError: questionExact.error,
  };
};
