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
import { Material } from "../services/type";
import { MaterialType, ServerStatsDataType } from "@/app/types/types";
import { logExceptionError } from "@/shared/lib/utils/exeption.sentry";
import { useEffect } from "react";

const useMaterials = (id?: number) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const materials = useQuery<MaterialType[]>({
    queryKey: ["materials"],
    queryFn: () => getAllMaterialsService(token),
    enabled: !!token,
  });

  const exactMaterial = useQuery<MaterialType, Error>({
    queryKey: ["exact-material", id],
    queryFn: ({ queryKey }) =>
      getOneMaterialService(token, queryKey[1] as number),
    enabled: !!id && !!token,
  });

  const createMaterialMutation = useMutation({
    mutationFn: (body: Material) => createMaterialService(token, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
    onError: (error) => {
      logExceptionError(error, { section: "", userID: user?.id });
    },
  });

  const deleteMaterialMutation = useMutation({
    mutationFn: (id: number) => deleteMaterialService(token, id),
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
      id: number;
      dataToUpdate: Partial<Material>;
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
  }, [materials.error, exactMaterial.error, stats.error]);

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
