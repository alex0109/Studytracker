"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import {
  IMaterialUpdate,
  materialKeys,
  updateMaterial,
} from "@/entities/material";

export const useMaterialUpdate = (id: string) => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: materialKeys.all });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `materials/${id} (update)`,
        userID: user?.id,
      });
    },
  });

  return {
    updateMaterial: updateMaterialMutation.mutate,
  };
};
