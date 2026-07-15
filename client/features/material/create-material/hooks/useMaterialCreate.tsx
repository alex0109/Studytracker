"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import {
  createMaterial,
  IMaterialCreate,
  materialKeys,
} from "@/entities/material";

export const useMaterialCreate = () => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const createMaterialMutation = useMutation({
    mutationFn: (body: IMaterialCreate) => createMaterial(token, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.all });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: "materials/ (create)",
        userID: user?.id,
      });
    },
  });

  return {
    createMaterial: createMaterialMutation.mutate,
    createMaterialData: createMaterialMutation.data,
  };
};
