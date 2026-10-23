"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { IFlashcardStats } from "../model";
import { flashcardKeys } from "../lib";
import { getFlashcardStats } from "../api";

export const useFlashcardStats = (dictionaryId: string) => {
  const { token, user } = useSession();

  const stats = useQuery<IFlashcardStats, Error>({
    queryKey: flashcardKeys.stats(dictionaryId),
    queryFn: () => getFlashcardStats(token, dictionaryId),
    enabled: !!dictionaryId && !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (stats.error) {
      logExceptionError(stats.error, {
        section: `dictionaries/${dictionaryId}/flashcards/stats`,
        userID: user?.id,
      });
    }
  }, [stats.error]);

  return {
    flashcardStatsData: stats.data,
    flashcardStatsIsPending: stats.isPending,
    flashcardStatsError: stats.error,
  };
};
