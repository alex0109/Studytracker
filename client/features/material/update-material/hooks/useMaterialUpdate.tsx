"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import {
  IMaterialResponse,
  IMaterialUpdate,
  materialKeys,
  updateMaterial,
} from "@/entities/material";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";

export const useMaterialUpdate = (id: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const updateMaterialMutation = useMutation({
    mutationFn: ({
      id,
      dataToUpdate,
    }: {
      id: string;
      dataToUpdate: IMaterialUpdate;
    }) => updateMaterial(token, id, dataToUpdate),
    // The answer is the saved material, so nothing is refetched: autosave while typing
    // costs one request, not a reload of the material and the whole list
    onSuccess: (updated) => {
      queryClient.setQueryData(materialKeys.detail(id), updated);
      queryClient.setQueryData<IMaterialResponse[]>(materialKeys.list(), (list) =>
        list?.map((material) =>
          material.id === id
            ? {
                ...material,
                title: updated.title,
                type: updated.type,
                status: updated.status,
                link: updated.link,
                isActive: updated.isActive,
                version: updated.version,
                updatedAt: updated.updatedAt,
              }
            : material,
        ),
      );
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `materials/${id} (update)`,
        userID: user?.id,
      });

      toast({
        title: `❌${t("toasts.materialUpdateError")}`,
        variant: "error",
      });
    },
  });

  return {
    updateMaterial: updateMaterialMutation.mutate,
    updateMaterialIsPending: updateMaterialMutation.isPending,
    updateMaterialIsError: updateMaterialMutation.isError,
  };
};
