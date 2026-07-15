"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMaterial, materialKeys } from "@/entities/material";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";

export const useMaterialDelete = (id: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const deleteMaterialMutation = useMutation({
    mutationFn: () => deleteMaterial(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.detail(id) });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `materials/${id} (delete)`,
        userID: user?.id,
      });
    },
  });

  return {
    deleteMaterial: deleteMaterialMutation.mutate,
  };
};
