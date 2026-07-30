"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { getResults } from "../api/getResults";
import { attemptKeys } from "../lib/attempt-query-keys";
import { IAttempt } from "../model";

export const useAttemptResults = (attemptId: string) => {
  const { token, user } = useSession();

  const attemptResults = useQuery<IAttempt, Error>({
    queryKey: attemptKeys.detail(attemptId),
    queryFn: () => getResults(token, attemptId),
    enabled: !!attemptId && !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (attemptResults.error) {
      logExceptionError(attemptResults.error, {
        section: `attempts/${attemptId}/results`,
        userID: user?.id,
      });
    }
  }, [attemptResults.error]);

  return {
    attemptResults: attemptResults.data,
    attemptResultsIsPending: attemptResults.isPending,
    attemptResultsError: attemptResults.error,
  };
};
