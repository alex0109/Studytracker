"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { IAiUsage } from "../model";
import { aiKeys } from "../lib";
import { getAiUsage } from "../api";

export const useAiUsage = (enabled = true) => {
  const { token, user } = useSession();

  const usage = useQuery<IAiUsage, Error>({
    queryKey: aiKeys.usage(),
    queryFn: () => getAiUsage(token),
    enabled: !!token && enabled,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (usage.error) {
      logExceptionError(usage.error, {
        section: "ai/usage",
        userID: user?.id,
      });
    }
  }, [usage.error]);

  return {
    aiUsageData: usage.data,
    aiUsageIsPending: usage.isPending,
  };
};
