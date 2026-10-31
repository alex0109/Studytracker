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
import { useTranslation } from "@/shared/i18n";
import { trackEvent } from "@/shared/lib/analytics";

export const useMaterialCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const createMaterialMutation = useMutation({
    mutationFn: (body: IMaterialCreate) => createMaterial(token, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.list() });
      trackEvent("create_material");

      toast({
        title: `🎉${t("toasts.materialCreated")}`,
        variant: "success",
      });
    },
    onError: (error) => {
      // Limit reached: show why and refresh the counter, this is not a bug to report
      const limitMessage = getLimitErrorMessage(error, t);
      if (limitMessage) {
        queryClient.invalidateQueries({ queryKey: materialKeys.list() });
        toast({ title: `⚠️${limitMessage}`, variant: "error" });
        return;
      }

      logExceptionError(error, {
        section: "materials/ (create)",
        userID: user?.id,
      });

      toast({
        title: `❌${t("toasts.materialCreateError")}`,
        variant: "error",
      });
    },
  });

  return {
    createMaterial: createMaterialMutation.mutate,
    createMaterialIsPending: createMaterialMutation.isPending,
  };
};
