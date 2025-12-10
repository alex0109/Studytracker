import { useQuery } from "@tanstack/react-query";

import { useSession } from "@/shared/context/session-provider.context";
import { ServerStatsDataType } from "@/app/types/types";
import { logExceptionError } from "@/shared/lib/utils/exeption.sentry";
import { useEffect } from "react";
import { getAdminStatsService } from "../services/material.service";

const useAdminMaterials = () => {
  const { token, user } = useSession();

  const stats = useQuery<ServerStatsDataType>({
    queryKey: ["stats"],
    queryFn: () => getAdminStatsService(token),
    enabled: !!token,
  });

  useEffect(() => {
    if (stats.error) {
      logExceptionError(stats.error, {
        section: "stats",
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

export default useAdminMaterials;
