"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib";
import { addTagToMaterial, materialKeys } from "@/entities/material";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";

export const useAddTagToMaterial = (materialId: string) => {
  const { t } = useTranslation();
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

      // The material itself came back in the answer, only the list is refetched
      queryClient.invalidateQueries({
        queryKey: materialKeys.list(),
        refetchType: "active",
      });

      toast({
        title: `✅${t("toasts.tagAddedToMaterial")}`,
        variant: "success",
      });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `materials/${materialId}/tags}`,
        userID: user?.id,
      });

      toast({
        title: `❌${t("toasts.tagAddError")}`,
        variant: "error",
      });
    },
  });

  return {
    addTagToMaterial: addTagToMaterialMutation.mutate,
  };
};
