"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { statisticsKeys } from "../lib/statistics-query-keys";
import { getTagPerformance } from "../api";
import { ITagPerformance } from "../model/tag-performance";

export const useStatisticsTagPerformance = () => {
  const { token, user } = useSession();

  const statisticsTagPerformance = useQuery<ITagPerformance[]>({
    queryKey: statisticsKeys.tagPerformance(),
    queryFn: () => getTagPerformance(token),
    enabled: !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (statisticsTagPerformance.error) {
      logExceptionError(statisticsTagPerformance.error, {
        section: "statistics/tags",
        userID: user?.id,
      });
    }
  }, [statisticsTagPerformance.error]);

  return {
    statisticsTagPerformanceData: statisticsTagPerformance.data,
    statisticsTagPerformanceLoading: statisticsTagPerformance.isLoading,
    statisticsTagPerformanceError: statisticsTagPerformance.error,
  };
};
