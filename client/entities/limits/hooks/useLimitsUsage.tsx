"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { ILimitsUsage } from "../model";
import { limitsKeys } from "../lib";
import { getLimitsUsage } from "../api";

export const useLimitsUsage = () => {
  const { token, user } = useSession();

  const usage = useQuery<ILimitsUsage, Error>({
    queryKey: limitsKeys.usage(),
    queryFn: () => getLimitsUsage(token),
    enabled: !!token,
  });

  useEffect(() => {
    if (usage.error) {
      logExceptionError(usage.error, {
        section: "limits/usage",
        userID: user?.id,
      });
    }
  }, [usage.error, user?.id]);

  return {
    limitsUsageData: usage.data,
    limitsUsageIsPending: usage.isPending,
    limitsUsageError: usage.error,
  };
};
