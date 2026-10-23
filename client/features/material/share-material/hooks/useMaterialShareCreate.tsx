"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { createMaterialShare, shareKeys } from "@/entities/share";

export const useMaterialShareCreate = (materialId: string) => {
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
        title: "❌Error occurred while creating share link",
        variant: "error",
      });
    },
  });

  return {
    createShare: createShareMutation.mutate,
    createShareIsPending: createShareMutation.isPending,
  };
};
