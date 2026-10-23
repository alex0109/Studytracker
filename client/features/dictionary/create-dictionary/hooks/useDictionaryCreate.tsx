"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { getLimitErrorMessage } from "@/shared/lib/limits";
import { toast } from "@/shared/radix-ui";
import {
  createDictionary,
  dictionaryKeys,
  IDictionaryCreate,
} from "@/entities/dictionary";

export const useDictionaryCreate = (materialId: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const createDictionaryMutation = useMutation({
    mutationFn: (body: IDictionaryCreate) =>
      createDictionary(token, materialId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dictionaryKeys.list(materialId),
      });

      toast({
        title: "🎉Dictionary has been created!",
        variant: "success",
      });
    },
    onError: (error) => {
      // Limit reached: show why and refresh the counter, this is not a bug to report
      const limitMessage = getLimitErrorMessage(error);
      if (limitMessage) {
        queryClient.invalidateQueries({ queryKey: dictionaryKeys.list(materialId) });
        toast({ title: `⚠️${limitMessage}`, variant: "error" });
        return;
      }

      logExceptionError(error, {
        section: `dictionaries/materials/${materialId} (create)`,
        userID: user?.id,
      });

      toast({
        title: "❌Error occurred while creating dictionary",
        variant: "error",
      });
    },
  });

  return {
    createDictionary: createDictionaryMutation.mutate,
    createDictionaryIsPending: createDictionaryMutation.isPending,
  };
};
