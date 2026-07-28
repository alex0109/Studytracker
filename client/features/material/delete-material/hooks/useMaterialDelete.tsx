"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMaterial, materialKeys } from "@/entities/material";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";

export const useMaterialDelete = (id: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const deleteMaterialMutation = useMutation({
    mutationFn: () => deleteMaterial(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.detail(id) });

      toast({
        title: "✅Material has been deleted!",
        variant: "success",
      });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `materials/${id} (delete)`,
        userID: user?.id,
      });

      toast({
        title: "❌Error occured while deleting material",
        variant: "error",
      });
    },
  });

  return {
    deleteMaterial: deleteMaterialMutation.mutate,
  };
};
