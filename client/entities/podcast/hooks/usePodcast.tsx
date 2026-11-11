"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { IPodcast } from "../model";
import { podcastKeys } from "../lib";
import { getPodcast } from "../api";

// Asked again every few seconds while the voices are being recorded
const POLL_WHILE_RECORDING_MS = 5000;

export const usePodcast = (materialId: string, enabled = true) => {
  const { token, user } = useSession();

  const query = useQuery<IPodcast | null, Error>({
    queryKey: podcastKeys.material(materialId),
    queryFn: () => getPodcast(token, materialId),
    enabled: enabled && !!token,
    // The audio link lives for hours; a fresh one comes with every load anyway
    staleTime: 60 * 60_000,
    refetchInterval: (current) => (current.state.data?.status === "Generating" ? POLL_WHILE_RECORDING_MS : false),
  });

  useEffect(() => {
    if (query.error) logExceptionError(query.error, { section: `materials/${materialId}/podcast`, userID: user?.id });
  }, [query.error, materialId, user?.id]);

  return {
    podcastData: query.data,
    podcastIsPending: query.isPending,
    podcastError: query.error,
    refetchPodcast: query.refetch,
  };
};
