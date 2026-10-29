"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { IQuestionResponse } from "@/entities/question";
import { dictionaryKeys } from "../lib";
import { getDictionaryQuestions } from "../api";

export const useDictionaryQuestions = (dictionaryId: string) => {
  const { token, user } = useSession();

  const questions = useQuery<IQuestionResponse[], Error>({
    queryKey: dictionaryKeys.questions(dictionaryId),
    queryFn: () => getDictionaryQuestions(token, dictionaryId),
    enabled: !!dictionaryId && !!token,
  });

  useEffect(() => {
    if (questions.error) {
      logExceptionError(questions.error, {
        section: `dictionaries/${dictionaryId}/questions`,
        userID: user?.id,
      });
    }
  }, [questions.error]);

  return {
    dictionaryQuestionsData: questions.data,
    dictionaryQuestionsIsPending: questions.isPending,
    dictionaryQuestionsError: questions.error,
  };
};
