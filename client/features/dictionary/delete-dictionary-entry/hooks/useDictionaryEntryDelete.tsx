"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { deleteDictionaryEntry, dictionaryKeys } from "@/entities/dictionary";

export const useDictionaryEntryDelete = (dictionaryId: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const deleteEntryMutation = useMutation({
    mutationFn: (entryId: string) => deleteDictionaryEntry(token, entryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dictionaryKeys.detail(dictionaryId),
      });
      queryClient.invalidateQueries({ queryKey: dictionaryKeys.lists() });

      toast({
        title: "✅Word successfully deleted",
        variant: "success",
      });
    },
    onError: (error, entryId) => {
      logExceptionError(error, {
        section: `dictionaries/entries/${entryId} (delete)`,
        userID: user?.id,
      });

      toast({
        title: "❌Error occurred while deleting word",
        variant: "error",
      });
    },
  });

  return {
    deleteEntry: deleteEntryMutation.mutate,
    deleteEntryIsPending: deleteEntryMutation.isPending,
  };
};
