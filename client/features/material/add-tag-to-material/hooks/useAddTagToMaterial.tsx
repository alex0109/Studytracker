"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib";
import { addTagToMaterial, materialKeys } from "@/entities/material";
import { toast } from "@/shared/radix-ui";

export const useAddTagToMaterial = (materialId: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const addTagToMaterialMutation = useMutation({
    mutationFn: ({
      materialId,
      tagId,
    }: {
      materialId: string;
      tagId: string;
    }) => addTagToMaterial(token, materialId, tagId),
    onSuccess: (updatedMaterial) => {
      queryClient.setQueryData(
        materialKeys.detail(materialId),
        updatedMaterial,
      );

      queryClient.invalidateQueries({
        queryKey: materialKeys.all,
        refetchType: "active",
      });

      toast({
        title: "✅Tag has been added to material",
        variant: "success",
      });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `materials/${materialId}/tags}`,
        userID: user?.id,
      });

      toast({
        title: "❌Error occured while adding tag to material",
        variant: "error",
      });
    },
  });

  return {
    addTagToMaterial: addTagToMaterialMutation.mutate,
  };
};
