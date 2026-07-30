"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { IQuestionReduced } from "../model";
import { getActiveReducedQuestions } from "../api";
import { questionKeys } from "../lib/question-query-keys";

export const useQuestionActiveReduced = (materialId: string) => {
  const { token, user } = useSession();

  const questionsActiveReduced = useQuery<IQuestionReduced[], Error>({
    queryKey: questionKeys.reducedActive(materialId),
    queryFn: () => {
      return getActiveReducedQuestions(token, materialId);
    },
    enabled: !!materialId && !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (questionsActiveReduced.error) {
      logExceptionError(questionsActiveReduced.error, {
        section: `materials/${materialId}/questions/reduced/active`,
        userID: user?.id,
      });
    }
  }, [questionsActiveReduced.error]);

  return {
    questionsActiveReducedData: questionsActiveReduced.data,
    questionsActiveReducedIsPending: questionsActiveReduced.isPending,
    questionsActiveReducedError: questionsActiveReduced.error,
  };
};
