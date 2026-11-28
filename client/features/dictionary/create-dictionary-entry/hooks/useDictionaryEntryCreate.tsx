"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context";
import { logExceptionError, getLimitErrorMessage } from "@/shared/lib";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import {
  createDictionaryEntry,
  dictionaryKeys,
  IDictionaryEntryCreate,
} from "@/entities/dictionary";
import { reviewKeys } from "@/entities/review";

export const useDictionaryEntryCreate = (dictionaryId: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const createEntryMutation = useMutation({
    mutationFn: (body: IDictionaryEntryCreate) =>
      createDictionaryEntry(token, dictionaryId, body),
    onSuccess: () => {
      // What "Today" waits for changed: its queue, the reminder and the count in the menu
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      queryClient.invalidateQueries({
        queryKey: dictionaryKeys.detail(dictionaryId),
      });
      queryClient.invalidateQueries({ queryKey: dictionaryKeys.lists() });

      toast({
        title: `🎉${t("toasts.wordAdded")}`,
        variant: "success",
      });
    },
    onError: (error) => {
      // Limit reached: show why and refresh the counter, this is not a bug to report
      const limitMessage = getLimitErrorMessage(error, t);
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
        title: `❌${t("toasts.wordAddError")}`,
        variant: "error",
      });
    },
  });

  return {
    createEntry: createEntryMutation.mutate,
    createEntryIsPending: createEntryMutation.isPending,
  };
};
