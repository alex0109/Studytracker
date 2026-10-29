"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMaterial, materialKeys } from "@/entities/material";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";

export const useMaterialDelete = (id: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const deleteMaterialMutation = useMutation({
    mutationFn: () => deleteMaterial(token, id),
    onSuccess: () => {
      // Its content and attempts are gone with it: drop them instead of refetching into a 404
      queryClient.removeQueries({ queryKey: materialKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: materialKeys.list() });

      toast({
        title: `✅${t("toasts.materialDeleted")}`,
        variant: "success",
      });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `materials/${id} (delete)`,
        userID: user?.id,
      });

      toast({
        title: `❌${t("toasts.materialDeleteError")}`,
        variant: "error",
      });
    },
  });

  return {
    deleteMaterial: deleteMaterialMutation.mutate,
  };
};
