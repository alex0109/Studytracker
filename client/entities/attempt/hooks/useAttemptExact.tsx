"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { IAttempt } from "../model";
import { getAttempt } from "../api/getAttempt";
import { attemptKeys } from "../lib/attempt-query-keys";

export const useAttemptExact = (attemptId: string) => {
  const { token, user } = useSession();

  const exactAttempt = useQuery<IAttempt, Error>({
    queryKey: attemptKeys.detail(attemptId),
    queryFn: () => getAttempt(token, attemptId),
    enabled: !!attemptId && !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (exactAttempt.error) {
      logExceptionError(exactAttempt.error, {
        section: `attempts/${attemptId}`,
        userID: user?.id,
      });
    }
  }, [exactAttempt.error]);

  return {
    exactAttempt: exactAttempt.data,
    exactAttemptLoading: exactAttempt.isLoading,
    exactAttemptError: exactAttempt.error,
  };
};
