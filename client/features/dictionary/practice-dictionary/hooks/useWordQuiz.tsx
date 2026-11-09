"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { dictionaryKeys, getWordQuiz, IWordQuiz } from "@/entities/dictionary";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";

// A new set of choices every time a word is forgotten: nothing is kept once the quiz is gone
export const useWordQuiz = (entryId: string) => {
  const { token, user } = useSession();

  const quiz = useQuery<IWordQuiz, Error>({
    queryKey: dictionaryKeys.quiz(entryId),
    queryFn: () => getWordQuiz(token, entryId),
    enabled: !!token,
    staleTime: Infinity,
    gcTime: 0,
    retry: 1,
  });

  useEffect(() => {
    if (quiz.error) logExceptionError(quiz.error, { section: `dictionaries/entries/${entryId}/quiz`, userID: user?.id });
  }, [entryId, quiz.error, user?.id]);

  return { quizData: quiz.data, quizIsPending: quiz.isPending, quizError: quiz.error };
};
