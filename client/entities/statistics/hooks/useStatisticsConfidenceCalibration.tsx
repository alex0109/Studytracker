"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { statisticsKeys } from "../lib/statistics-query-keys";
import { getConfidenceCalibration } from "../api";
import { IConfidenceCalibration } from "../model/confidence-calibration";

export const useStatisticsConfidenceCalibration = () => {
  const { token, user } = useSession();

  const statisticsConfidenceCalibration = useQuery<IConfidenceCalibration[]>({
    queryKey: statisticsKeys.confidenceLevel(),
    queryFn: () => getConfidenceCalibration(token),
    enabled: !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (statisticsConfidenceCalibration.error) {
      logExceptionError(statisticsConfidenceCalibration.error, {
        section: "statistics/confidence",
        userID: user?.id,
      });
    }
  }, [statisticsConfidenceCalibration.error]);

  return {
    statisticsConfidenceCalibrationData: statisticsConfidenceCalibration.data,
    statisticsConfidenceCalibrationIsPending:
      statisticsConfidenceCalibration.isPending,
    statisticsConfidenceCalibrationError: statisticsConfidenceCalibration.error,
  };
};
