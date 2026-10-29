"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { getLimitErrorMessage } from "@/shared/lib/limits";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import {
  createDictionaryEntry,
  dictionaryKeys,
  IDictionaryEntryCreate,
} from "@/entities/dictionary";

export const useDictionaryEntryCreate = (dictionaryId: string) => {
  const { t } = useTranslation();
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
