"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { getLimitErrorMessage } from "@/shared/lib/limits";
import { toast } from "@/shared/radix-ui";
import {
  createDictionaryEntry,
  dictionaryKeys,
  IDictionaryEntryCreate,
} from "@/entities/dictionary";

export const useDictionaryEntryCreate = (dictionaryId: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const createEntryMutation = useMutation({
    mutationFn: (body: IDictionaryEntryCreate) =>
      createDictionaryEntry(token, dictionaryId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dictionaryKeys.detail(dictionaryId),
      });
      queryClient.invalidateQueries({ queryKey: dictionaryKeys.lists() });

      toast({
        title: "🎉Word has been added!",
        variant: "success",
      });
    },
    onError: (error) => {
      // Limit reached: show why and refresh the counter, this is not a bug to report
      const limitMessage = getLimitErrorMessage(error);
      if (limitMessage) {
        queryClient.invalidateQueries({ queryKey: dictionaryKeys.detail(dictionaryId) });
        toast({ title: `⚠️${limitMessage}`, variant: "error" });
        return;
      }

      logExceptionError(error, {
        section: `dictionaries/${dictionaryId}/entries (create)`,
        userID: user?.id,
      });

      toast({
        title: "❌Error occurred while adding word",
        variant: "error",
      });
    },
  });

  return {
    createEntry: createEntryMutation.mutate,
    createEntryIsPending: createEntryMutation.isPending,
  };
};
