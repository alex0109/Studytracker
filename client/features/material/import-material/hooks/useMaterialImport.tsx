"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { getLimitErrorMessage } from "@/shared/lib/limits";
import { toast } from "@/shared/radix-ui";
import { materialKeys } from "@/entities/material";
import { importSharedMaterial, shareKeys } from "@/entities/share";

export const useMaterialImport = (shareToken: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const importMutation = useMutation({
    mutationFn: () => importSharedMaterial(token, shareToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.all });
      queryClient.invalidateQueries({ queryKey: shareKeys.all });

      toast({
        title: "🎉Material has been added to your materials!",
        variant: "success",
      });
    },
    onError: (error) => {
      const limitMessage = getLimitErrorMessage(error);
      if (limitMessage) {
        toast({ title: `⚠️${limitMessage}`, variant: "error" });
        return;
      }

      logExceptionError(error, {
        section: `shares/${shareToken}/import`,
        userID: user?.id,
      });

      toast({
        title: "❌Error occurred while importing material",
        variant: "error",
      });
    },
  });

  return {
    importMaterial: importMutation.mutate,
    importMaterialIsPending: importMutation.isPending,
  };
};
