"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { statisticsKeys } from "../lib/statistics-query-keys";
import { getDifficultyBreakdown } from "../api";
import { IDifficultyStat } from "../model/difficulty-stat";

export const useStatisticsDifficultyBreakdown = () => {
  const { token, user } = useSession();

  const statisticsDifficultyBreakdown = useQuery<IDifficultyStat[]>({
    queryKey: statisticsKeys.difficultyBreakdown(),
    queryFn: () => getDifficultyBreakdown(token),
    enabled: !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (statisticsDifficultyBreakdown.error) {
      logExceptionError(statisticsDifficultyBreakdown.error, {
        section: "statistics/difficulty",
        userID: user?.id,
      });
    }
  }, [statisticsDifficultyBreakdown.error]);

  return {
    statisticsDifficultyBreakdownData: statisticsDifficultyBreakdown.data,
    statisticsDifficultyBreakdownLoading:
      statisticsDifficultyBreakdown.isLoading,
    statisticsDifficultyBreakdownError: statisticsDifficultyBreakdown.error,
  };
};
