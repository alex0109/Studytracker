"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import {
  dictionaryKeys,
  IDictionaryUpdate,
  updateDictionary,
} from "@/entities/dictionary";

export const useDictionaryUpdate = (dictionaryId: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const updateDictionaryMutation = useMutation({
    mutationFn: ({ dataToUpdate }: { dataToUpdate: IDictionaryUpdate }) =>
      updateDictionary(token, dictionaryId, dataToUpdate),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dictionaryKeys.detail(dictionaryId),
      });
      queryClient.invalidateQueries({ queryKey: dictionaryKeys.lists() });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `dictionaries/${dictionaryId} (update)`,
        userID: user?.id,
      });

      toast({
        title: "❌Error occurred while updating dictionary",
        variant: "error",
      });
    },
  });

  return {
    updateDictionary: updateDictionaryMutation.mutate,
    updateDictionaryIsPending: updateDictionaryMutation.isPending,
  };
};
