"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { IQuestionReduced } from "../model";
import { getAllReducedQuestions } from "../api";
import { questionKeys } from "../lib/question-query-keys";

export const useQuestionAllReduced = (materialId: string) => {
  const { token, user } = useSession();

  const questionsAllReduced = useQuery<IQuestionReduced[], Error>({
    queryKey: questionKeys.reducedAll(materialId),
    queryFn: () => {
      return getAllReducedQuestions(token, materialId);
    },
    enabled: !!materialId && !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (questionsAllReduced.error) {
      logExceptionError(questionsAllReduced.error, {
        section: `materials/${materialId}/questions/reduced`,
        userID: user?.id,
      });
    }
  }, [questionsAllReduced.error]);

  return {
    questionsAllReducedData: questionsAllReduced.data,
    questionsAllReducedIsPending: questionsAllReduced.isPending,
    questionsAllReducedError: questionsAllReduced.error,
  };
};
