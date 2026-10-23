"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { IUserLimits } from "../model";
import { limitsKeys } from "../lib";
import { getLimits } from "../api";

// Limits change only with a deploy, so they are fetched once per session
export const useLimits = () => {
  const { token, user } = useSession();

  const limits = useQuery<IUserLimits, Error>({
    queryKey: limitsKeys.all,
    queryFn: () => getLimits(token),
    enabled: !!token,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (limits.error) {
      logExceptionError(limits.error, {
        section: "limits",
        userID: user?.id,
      });
    }
  }, [limits.error]);

  return {
    limitsData: limits.data,
    limitsIsPending: limits.isPending,
  };
};
