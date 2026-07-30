"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { IStatisticsOverview } from "../model/statistics-overview";
import { statisticsKeys } from "../lib/statistics-query-keys";
import { getOverview } from "../api";

export const useStatisticsOverview = () => {
  const { token, user } = useSession();

  const statisticsOverview = useQuery<IStatisticsOverview>({
    queryKey: statisticsKeys.overview(),
    queryFn: () => getOverview(token),
    enabled: !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (statisticsOverview.error) {
      logExceptionError(statisticsOverview.error, {
        section: "statistics/overview",
        userID: user?.id,
      });
    }
  }, [statisticsOverview.error]);

  return {
    statisticsOverviewData: statisticsOverview.data,
    statisticsOverviewIsPending: statisticsOverview.isPending,
    statisticsOverviewError: statisticsOverview.error,
  };
};
