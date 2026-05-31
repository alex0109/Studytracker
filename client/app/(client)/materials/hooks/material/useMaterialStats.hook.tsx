import { useQuery } from "@tanstack/react-query";
import { getStatsService } from "../../services/material.service";

import { useSession } from "@/shared/context/session-provider.context";
import { logExceptionError } from "@/shared/lib/utils/exeption.sentry";
import { useEffect } from "react";
import { ServerStatsDataType } from "@/app/types/stats/statistics.type";

const useMaterialStats = () => {
  const { token, user } = useSession();

  const stats = useQuery<ServerStatsDataType>({
    queryKey: ["stats"],
    queryFn: () => getStatsService(token),
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
    statsLoading: stats.isLoading,
    statsError: stats.error,
  };
};

export default useMaterialStats;
