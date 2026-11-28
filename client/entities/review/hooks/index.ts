"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context";
import { logExceptionError } from "@/shared/lib";
import { getReviewDaySummary, getReviewToday } from "../api";
import { reviewKeys } from "../lib";
import { IReviewDaySummary, IReviewToday } from "../model";

export const useReviewToday = () => {
  const { token, user } = useSession();

  const today = useQuery<IReviewToday, Error>({
    queryKey: reviewKeys.today(),
    queryFn: () => getReviewToday(token),
    enabled: !!token,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (today.error) {
      logExceptionError(today.error, { section: "review/today", userID: user?.id });
    }
  }, [today.error, user?.id]);

  return {
    todayData: today.data,
    todayIsPending: today.isPending,
    todayError: today.error,
  };
};

// Read once the queue is done, so it counts every answer just given
export const useReviewDaySummary = (enabled: boolean) => {
  const { token, user } = useSession();

  const summary = useQuery<IReviewDaySummary, Error>({
    queryKey: reviewKeys.summary(),
    queryFn: () => getReviewDaySummary(token),
    enabled: enabled && !!token,
    staleTime: 0,
  });

  useEffect(() => {
    if (summary.error) {
      logExceptionError(summary.error, { section: "review/today/summary", userID: user?.id });
    }
  }, [summary.error, user?.id]);

  return {
    summaryData: summary.data,
    summaryIsPending: summary.isPending,
  };
};
