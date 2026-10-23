"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { deleteDictionary, dictionaryKeys } from "@/entities/dictionary";

export const useDictionaryDelete = (materialId: string, dictionaryId: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const deleteDictionaryMutation = useMutation({
    mutationFn: () => deleteDictionary(token, dictionaryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dictionaryKeys.list(materialId),
      });

      toast({
        title: "✅Dictionary has been deleted!",
        variant: "success",
      });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `dictionaries/${dictionaryId} (delete)`,
        userID: user?.id,
      });

      toast({
        title: "❌Error occurred while deleting dictionary",
        variant: "error",
      });
    },
  });

  return {
    deleteDictionary: deleteDictionaryMutation.mutate,
    deleteDictionaryIsPending: deleteDictionaryMutation.isPending,
  };
};
