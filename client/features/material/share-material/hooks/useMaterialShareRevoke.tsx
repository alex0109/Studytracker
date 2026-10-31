"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { revokeMaterialShare, shareKeys } from "@/entities/share";

export const useMaterialShareRevoke = (materialId: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const revokeShareMutation = useMutation({
    mutationFn: () => revokeMaterialShare(token, materialId),
    onSuccess: () => {
      queryClient.setQueryData(shareKeys.material(materialId), null);

      toast({
        title: `✅${t("toasts.shareDisabled")}`,
        variant: "success",
      });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `materials/${materialId}/share (delete)`,
        userID: user?.id,
      });

      toast({
        title: `❌${t("toasts.shareDisableError")}`,
        variant: "error",
      });
    },
  });

  return {
    revokeShare: revokeShareMutation.mutate,
    revokeShareIsPending: revokeShareMutation.isPending,
  };
};
