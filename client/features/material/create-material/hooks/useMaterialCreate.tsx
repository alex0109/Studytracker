"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import {
  createMaterial,
  IMaterialCreate,
  materialKeys,
} from "@/entities/material";
import { toast } from "@/shared/radix-ui";

export const useMaterialCreate = () => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const createMaterialMutation = useMutation({
    mutationFn: (body: IMaterialCreate) => createMaterial(token, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.all });

      toast({
        title: "🎉Material has been created!",
        variant: "success",
      });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: "materials/ (create)",
        userID: user?.id,
      });

      toast({
        title: "❌Error occured while creating material",
        variant: "error",
      });
    },
  });

  return {
    createMaterial: createMaterialMutation.mutate,
    createMaterialIsPending: createMaterialMutation.isPending,
  };
};
