"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { IQuestionResponse } from "../model";
import { getQuestion } from "../api";
import { questionKeys } from "../lib/question-query-keys";

export const useQuestionExact = (materialId: string, id: string) => {
  const { token, user } = useSession();

  const questionExact = useQuery<IQuestionResponse, Error>({
    queryKey: questionKeys.detail(materialId, id),
    queryFn: ({ queryKey }) => {
      return getQuestion(token, queryKey[1] as string, queryKey[2] as string);
    },
    enabled: !!materialId && !!id && !!token,
  });

  useEffect(() => {
    if (questionExact.error) {
      logExceptionError(questionExact.error, {
        section: `materials/${materialId}/questions/${id}`,
        userID: user?.id,
      });
    }
  }, [id, materialId, questionExact.error, user?.id]);

  return {
    questionExact: questionExact.data,
    questionExactIsPending: questionExact.isPending,
    questionExactError: questionExact.error,
  };
};
