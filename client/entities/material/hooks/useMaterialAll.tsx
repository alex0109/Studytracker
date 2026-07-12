"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { IMaterialResponse } from "../model";
import { getAllMaterials } from "../api/getAllMaterials";
import { materialKeys } from "../lib";

export const useMaterialAll = () => {
  const { token, user } = useSession();

  const materials = useQuery<IMaterialResponse[]>({
    queryKey: materialKeys.all,
    queryFn: () => getAllMaterials(token),
    enabled: !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (materials.error) {
      logExceptionError(materials.error, {
        section: "materials",
        userID: user?.id,
      });
    }
  }, [materials.error]);

  return {
    materialsData: materials.data,
    materialsLoading: materials.isLoading,
    materialsError: materials.error,
  };
};
