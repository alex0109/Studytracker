"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { createMaterialShare, shareKeys } from "@/entities/share";

export const useMaterialShareCreate = (materialId: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const createShareMutation = useMutation({
    mutationFn: () => createMaterialShare(token, materialId),
    onSuccess: (share) => {
      queryClient.setQueryData(shareKeys.material(materialId), share);
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `materials/${materialId}/share (create)`,
        userID: user?.id,
      });

      toast({
        title: `❌${t("toasts.shareCreateError")}`,
        variant: "error",
      });
    },
  });

  return {
    createShare: createShareMutation.mutate,
    createShareIsPending: createShareMutation.isPending,
  };
};
