"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context";
import { logExceptionError } from "@/shared/lib";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import {
  dictionaryKeys,
  IDictionaryEntryUpdate,
  updateDictionaryEntry,
} from "@/entities/dictionary";
import { reviewKeys } from "@/entities/review";

export const useDictionaryEntryUpdate = (
  dictionaryId: string,
  entryId?: string,
) => {
  const { t } = useTranslation();
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
    onSuccess: (_, { entryId, dataToUpdate }) => {
      queryClient.invalidateQueries({
        queryKey: dictionaryKeys.detail(dictionaryId),
      });
      // Archiving takes a word out of "Today"; ordinary edits leave the queue as it is
      if (dataToUpdate.isArchived !== undefined) queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      queryClient.invalidateQueries({ queryKey: dictionaryKeys.entry(entryId) });
      queryClient.invalidateQueries({ queryKey: dictionaryKeys.lists() });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `dictionaries/entries/${entryId} (update)`,
        userID: user?.id,
      });

      toast({
        title: `❌${t("toasts.wordUpdateError")}`,
        variant: "error",
      });
    },
  });

  return {
    updateEntry: updateEntryMutation.mutate,
    updateEntryIsPending: updateEntryMutation.isPending,
  };
};
