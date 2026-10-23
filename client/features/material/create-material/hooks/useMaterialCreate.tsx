"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { getLimitErrorMessage } from "@/shared/lib/limits";
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
      // Limit reached: show why and refresh the counter, this is not a bug to report
      const limitMessage = getLimitErrorMessage(error);
      if (limitMessage) {
        queryClient.invalidateQueries({ queryKey: materialKeys.all });
        toast({ title: `⚠️${limitMessage}`, variant: "error" });
        return;
      }

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
