"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { statisticsKeys } from "../lib/statistics-query-keys";
import { getAttemptTrend } from "../api";
import { IAttemptTrendPoint } from "../model/attempt-trend-point";

export const useStatisticsAttemtTrend = () => {
  const { token, user } = useSession();

  const statisticsAttemtTrend = useQuery<IAttemptTrendPoint[]>({
    queryKey: statisticsKeys.attemptTrend(),
    queryFn: () => getAttemptTrend(token),
    enabled: !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (statisticsAttemtTrend.error) {
      logExceptionError(statisticsAttemtTrend.error, {
        section: "statistics/trend",
        userID: user?.id,
      });
    }
  }, [statisticsAttemtTrend.error]);

  return {
    statisticsAttemtTrendData: statisticsAttemtTrend.data,
    statisticsAttemtTrendLoading: statisticsAttemtTrend.isLoading,
    statisticsAttemtTrendError: statisticsAttemtTrend.error,
  };
};
