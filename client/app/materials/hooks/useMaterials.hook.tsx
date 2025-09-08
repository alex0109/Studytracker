import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMaterialService,
  deleteMaterialService,
  getAllMaterialsService,
  getOneMaterialService,
  updateMaterialService,
} from "../services/material.service";
import { MaterialType } from "../components/material-carousel/types";
import { useSession } from "@/shared/context/session-provider.context";
import { Material } from "../services/type";

const useMaterials = (id?: number) => {
  const queryClient = useQueryClient();
  const { token } = useSession();

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
  });

  const deleteMaterialMutation = useMutation({
    mutationFn: (id: number) => deleteMaterialService(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
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
    updateMaterial: updateMaterialMutation.mutate,
  };
};

export default useMaterials;
