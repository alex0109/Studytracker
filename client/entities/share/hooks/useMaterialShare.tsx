"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { IMaterialShare } from "../model";
import { shareKeys } from "../lib";
import { getMaterialShare } from "../api";

export const useMaterialShare = (materialId: string, enabled = true) => {
  const { token, user } = useSession();

  const share = useQuery<IMaterialShare | null, Error>({
    queryKey: shareKeys.material(materialId),
    queryFn: () => getMaterialShare(token, materialId),
    enabled: enabled && !!materialId && !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (share.error) {
      logExceptionError(share.error, {
        section: `materials/${materialId}/share`,
        userID: user?.id,
      });
    }
  }, [share.error]);

  return {
    materialShareData: share.data,
    materialShareIsPending: share.isPending,
    materialShareError: share.error,
  };
};
