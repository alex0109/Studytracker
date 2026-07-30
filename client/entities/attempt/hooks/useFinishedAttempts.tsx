"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { attemptKeys, IAttempt } from "@/entities/attempt";
import { materialKeys } from "../../material/lib";
import { getFinishedAttempts } from "../api/getAttempts";

export const useFinishedAttempts = (materialId: string) => {
  const { token, user } = useSession();

  const attempts = useQuery<IAttempt[], Error>({
    queryKey: attemptKeys.finished(materialId),
    queryFn: () => getFinishedAttempts(token, materialId),
    enabled: !!materialId && !!token,
    staleTime: 10000,
    retry: (failureCount, error) => {
      if (
        error instanceof Error &&
        "status" in error &&
        (error as any).status === 404
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });

  useEffect(() => {
    if (attempts.error) {
      logExceptionError(attempts.error, {
        section: `attempts/finished`,
        userID: user?.id,
      });
    }
  }, [attempts.error]);

  return {
    finishedAttempts: attempts.data,
    finishedAttemptsIsPending: attempts.isPending,
    finishedAttemptsError: attempts.error,
  };
};
