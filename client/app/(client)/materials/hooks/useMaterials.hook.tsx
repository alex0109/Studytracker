import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMaterialService,
  deleteMaterialService,
  getAllMaterialsService,
  getOneMaterialService,
  getStatsService,
  updateMaterialService,
} from "../services/material.service";

import { useSession } from "@/shared/context/session-provider.context";
import {
  IMaterial,
  ServerStatsDataType,
  TUpdateMaterial,
} from "@/app/types/types";
import { logExceptionError } from "@/shared/lib/utils/exeption.sentry";
import { useEffect } from "react";

const useMaterials = (id?: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const materials = useQuery<TUpdateMaterial[]>({
    queryKey: ["materials"],
    queryFn: () => getAllMaterialsService(token),
    enabled: !!token,
  });

  const exactMaterial = useQuery<TUpdateMaterial, Error>({
    queryKey: ["exact-material", id],
    queryFn: ({ queryKey }) => {
      return getOneMaterialService(token, queryKey[1] as string);
    },
    enabled: !!id && !!token,
  });

  const createMaterialMutation = useMutation({
    mutationFn: (body: IMaterial) => createMaterialService(token, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
    onError: (error) => {
      logExceptionError(error, { section: "", userID: user?.id });
    },
  });

  const deleteMaterialMutation = useMutation({
    mutationFn: (id: string) => deleteMaterialService(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
    onError: (error) => {
      logExceptionError(error, { section: "", userID: user?.id });
    },
  });

  const updateMaterialMutation = useMutation({
    mutationFn: ({
      id,
      dataToUpdate,
    }: {
      id: string;
      dataToUpdate: Partial<IMaterial>;
    }) => updateMaterialService(token, id, dataToUpdate),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["materials", updated.id] });
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
    onError: (error) => {
      logExceptionError(error, { section: "", userID: user?.id });
    },
  });

  const stats = useQuery<ServerStatsDataType>({
    queryKey: ["stats"],
    queryFn: () => getStatsService(token),
    enabled: !!token,
  });

  useEffect(() => {
    if (materials.error) {
      logExceptionError(materials.error, {
        section: "materials",
        userID: user?.id,
      });
    }
    if (exactMaterial.error) {
      logExceptionError(exactMaterial.error, {
        section: "exactMaterial",
        userID: user?.id,
      });
    }
    if (stats.error) {
      logExceptionError(stats.error, {
        section: "stats",
        userID: user?.id,
      });
    }
  }, [materials, materials.error, exactMaterial.error, stats.error]);

  return {
    materialsData: materials.data,
    materialsLoading: materials.isLoading,
    materialsError: materials.error,
    exactMaterial: exactMaterial.data,
    exactMaterialLoading: exactMaterial.isLoading,
    exactMaterialError: exactMaterial.error,
    statsData: stats.data,
    statsLoading: stats.isLoading,
    statsError: stats.error,
    createMaterial: createMaterialMutation.mutate,
    deleteMaterial: deleteMaterialMutation.mutate,
    updateMaterial: updateMaterialMutation.mutate,
  };
};

export default useMaterials;
