"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { IMaterialResponse } from "@/entities/material";
import { tagKeys } from "../lib/tag-query-keys";
import { getMaterialsByTag } from "../api";

export const useMaterialsByTag = (tagId: string) => {
  const { token, user } = useSession();

  const materialsByTag = useQuery<IMaterialResponse[]>({
    queryKey: tagKeys.all,
    queryFn: () => getMaterialsByTag(token, tagId),
    enabled: !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (materialsByTag.error) {
      logExceptionError(materialsByTag.error, {
        section: "materials",
        userID: user?.id,
      });
    }
  }, [materialsByTag.error]);

  return {
    materialsByTagData: materialsByTag.data,
    materialsByTagIsPending: materialsByTag.isPending,
    materialsByTagError: materialsByTag.error,
  };
};
