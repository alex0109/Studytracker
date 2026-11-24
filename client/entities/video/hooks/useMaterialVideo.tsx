"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context";
import { logExceptionError } from "@/shared/lib";
import { IMaterialVideo } from "../model";
import { videoKeys } from "../lib";
import { getMaterialVideo } from "../api";

export const useMaterialVideo = (materialId: string, enabled = true) => {
  const { token, user } = useSession();

  const query = useQuery<IMaterialVideo | null, Error>({
    queryKey: videoKeys.material(materialId),
    queryFn: () => getMaterialVideo(token, materialId),
    enabled: enabled && !!token,
    // Subtitles change only when the user asks for new ones
    staleTime: 60 * 60_000,
  });

  useEffect(() => {
    if (query.error) logExceptionError(query.error, { section: `materials/${materialId}/video`, userID: user?.id });
  }, [query.error, materialId, user?.id]);

  return {
    videoData: query.data,
    videoIsPending: query.isPending,
    videoError: query.error,
  };
};
