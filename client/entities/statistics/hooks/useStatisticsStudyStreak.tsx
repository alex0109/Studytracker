"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { statisticsKeys } from "../lib/statistics-query-keys";
import { getStudyStreak } from "../api";
import { IStudyStreak } from "../model/study-streak";

export const useStatisticsStudyStreak = () => {
  const { token, user } = useSession();

  const statisticsStudyStreak = useQuery<IStudyStreak>({
    queryKey: statisticsKeys.studyStreak(),
    queryFn: () => getStudyStreak(token),
    enabled: !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (statisticsStudyStreak.error) {
      logExceptionError(statisticsStudyStreak.error, {
        section: "statistics/streak",
        userID: user?.id,
      });
    }
  }, [statisticsStudyStreak.error]);

  return {
    statisticsStudyStreakData: statisticsStudyStreak.data,
    statisticsStudyStreakIsPending: statisticsStudyStreak.isPending,
    statisticsStudyStreakError: statisticsStudyStreak.error,
  };
};
