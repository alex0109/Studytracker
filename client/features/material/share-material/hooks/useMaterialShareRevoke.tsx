"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { revokeMaterialShare, shareKeys } from "@/entities/share";

export const useMaterialShareRevoke = (materialId: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const revokeShareMutation = useMutation({
    mutationFn: () => revokeMaterialShare(token, materialId),
    onSuccess: () => {
      queryClient.setQueryData(shareKeys.material(materialId), null);

      toast({
        title: "✅Link is disabled, nobody can import it anymore",
        variant: "success",
      });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `materials/${materialId}/share (delete)`,
        userID: user?.id,
      });

      toast({
        title: "❌Error occurred while disabling share link",
        variant: "error",
      });
    },
  });

  return {
    revokeShare: revokeShareMutation.mutate,
    revokeShareIsPending: revokeShareMutation.isPending,
  };
};
