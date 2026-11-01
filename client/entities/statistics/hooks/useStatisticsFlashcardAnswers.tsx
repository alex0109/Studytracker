"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { statisticsKeys } from "../lib/statistics-query-keys";
import { getFlashcardAnswers } from "../api";
import { IFlashcardAnswers } from "../model/flashcard-answers";

export const useStatisticsFlashcardAnswers = (days = 30) => {
  const { token, user } = useSession();

  const statisticsFlashcardAnswers = useQuery<IFlashcardAnswers>({
    queryKey: statisticsKeys.flashcardAnswers(days),
    queryFn: () => getFlashcardAnswers(token, days),
    enabled: !!token,
  });

  useEffect(() => {
    if (statisticsFlashcardAnswers.error) {
      logExceptionError(statisticsFlashcardAnswers.error, {
        section: "statistics/flashcards",
        userID: user?.id,
      });
    }
  }, [statisticsFlashcardAnswers.error, user?.id]);

  return {
    statisticsFlashcardAnswersData: statisticsFlashcardAnswers.data,
    statisticsFlashcardAnswersIsPending: statisticsFlashcardAnswers.isPending,
  };
};
