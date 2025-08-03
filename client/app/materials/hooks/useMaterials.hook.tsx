import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMaterialService,
  deleteMaterialService,
  getAllMaterialsService,
  getOneMaterialService,
} from "../services/material.service";
import { MaterialType } from "../components/material-carousel/types";

const useMaterials = (id?: number) => {
  const queryClient = useQueryClient();

  const materials = useQuery<MaterialType[]>({
    queryKey: ["materials"],
    queryFn: getAllMaterialsService,
  });

  const exactMaterial = useQuery<MaterialType, Error>({
    queryKey: ["exact-material", id],
    queryFn: ({ queryKey }) => getOneMaterialService(queryKey[1] as number),
    enabled: !!id,
  });

  const createMaterialMutation = useMutation({
    mutationFn: createMaterialService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
  });

  const deleteMaterialMutation = useMutation({
    mutationFn: deleteMaterialService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
  });

  return {
    materialsData: materials.data,
    materialsLoading: materials.isLoading,
    materialsError: materials.error,
    exactMaterial: exactMaterial.data,
    exactMaterialLoading: exactMaterial.isLoading,
    exactMaterialError: exactMaterial.error,
    createMaterial: createMaterialMutation.mutate,
    deleteMaterial: deleteMaterialMutation.mutate,
  };
};

export default useMaterials;
