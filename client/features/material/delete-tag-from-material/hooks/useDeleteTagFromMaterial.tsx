"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib";
import { deleteTagFromMaterial, materialKeys } from "@/entities/material";

export const useDeleteTagFromMaterial = (materialId: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const useDeleteTagFromMaterialMutation = useMutation({
    mutationFn: ({
      materialId,
      tagId,
    }: {
      materialId: string;
      tagId: string;
    }) => deleteTagFromMaterial(token, materialId, tagId),
    onSuccess: (updatedMaterial) => {
      queryClient.setQueryData(
        materialKeys.detail(materialId),
        updatedMaterial,
      );

      queryClient.invalidateQueries({
        queryKey: materialKeys.all,
        refetchType: "active",
      });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `materials/${materialId}/tags}`,
        userID: user?.id,
      });
    },
  });

  return {
    deleteTagFromMaterial: useDeleteTagFromMaterialMutation.mutate,
  };
};
