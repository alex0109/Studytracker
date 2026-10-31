"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { getLimitErrorMessage } from "@/shared/lib/limits";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { materialKeys } from "@/entities/material";
import { importSharedMaterial, shareKeys } from "@/entities/share";

export const useMaterialImport = (shareToken: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const importMutation = useMutation({
    mutationFn: () => importSharedMaterial(token, shareToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.list() });
      queryClient.invalidateQueries({ queryKey: shareKeys.all });

      toast({
        title: `🎉${t("toasts.materialImported")}`,
        variant: "success",
      });
    },
    onError: (error) => {
      const limitMessage = getLimitErrorMessage(error, t);
      if (limitMessage) {
        toast({ title: `⚠️${limitMessage}`, variant: "error" });
        return;
      }

      logExceptionError(error, {
        section: `shares/${shareToken}/import`,
        userID: user?.id,
      });

      toast({
        title: `❌${t("toasts.materialImportError")}`,
        variant: "error",
      });
    },
  });

  return {
    importMaterial: importMutation.mutate,
    importMaterialIsPending: importMutation.isPending,
  };
};
