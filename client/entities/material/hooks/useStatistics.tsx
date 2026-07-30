"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStatistics } from "../api";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { IStatistics } from "../model";

export const useStatistics = () => {
  const { token, user } = useSession();

  const stats = useQuery<IStatistics>({
    queryKey: ["stats"],
    queryFn: () => getStatistics(token),
    enabled: !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (stats.error) {
      logExceptionError(stats.error, {
        section: "materials/stats",
        userID: user?.id,
      });
    }
  }, [stats.error]);

  return {
    statsData: stats.data,
    statsIsPending: stats.isPending,
    statsError: stats.error,
  };
};
