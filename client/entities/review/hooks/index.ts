"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { getReviewToday } from "../api";
import { reviewKeys } from "../lib";
import { IReviewToday } from "../model";

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
