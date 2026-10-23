"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import {
  dictionaryKeys,
  IDictionaryEntryUpdate,
  updateDictionaryEntry,
} from "@/entities/dictionary";

export const useDictionaryEntryUpdate = (
  dictionaryId: string,
  entryId?: string,
) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const updateEntryMutation = useMutation({
    mutationFn: ({
      entryId,
      dataToUpdate,
    }: {
      entryId: string;
      dataToUpdate: IDictionaryEntryUpdate;
    }) => updateDictionaryEntry(token, entryId, dataToUpdate),
    onSuccess: (_, { entryId }) => {
      queryClient.invalidateQueries({
        queryKey: dictionaryKeys.detail(dictionaryId),
      });
      queryClient.invalidateQueries({ queryKey: dictionaryKeys.entry(entryId) });
      queryClient.invalidateQueries({ queryKey: dictionaryKeys.lists() });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `dictionaries/entries/${entryId} (update)`,
        userID: user?.id,
      });

      toast({
        title: "❌Error occurred while updating word",
        variant: "error",
      });
    },
  });

  return {
    updateEntry: updateEntryMutation.mutate,
    updateEntryIsPending: updateEntryMutation.isPending,
  };
};
