"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { dictionaryKeys } from "@/entities/dictionary";
import {
  aiKeys,
  generateDictionaryEntries,
  getAiErrorMessage,
  IDictionaryEntriesGenerate,
} from "@/entities/ai";

export const useDictionaryEntriesGenerate = (dictionaryId: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const generateEntriesMutation = useMutation({
    mutationFn: (body: IDictionaryEntriesGenerate) =>
      generateDictionaryEntries(token, dictionaryId, body),
    onSuccess: (entries) => {
      queryClient.invalidateQueries({
        queryKey: dictionaryKeys.detail(dictionaryId),
      });
      queryClient.invalidateQueries({ queryKey: dictionaryKeys.lists() });

      toast({
        title: `✨${t("toasts.wordsGenerated", { count: entries.length })}`,
        variant: "success",
      });
    },
    onError: (error) => {
      // Quota, AI down or nothing to generate from: tell why, this is not a bug to report
      const aiMessage = getAiErrorMessage(error, t);
      if (aiMessage) {
        queryClient.invalidateQueries({
          queryKey: dictionaryKeys.detail(dictionaryId),
        });
        toast({ title: `⚠️${aiMessage}`, variant: "error" });
        return;
      }

      logExceptionError(error, {
        section: `ai/dictionaries/${dictionaryId}/entries (generate)`,
        userID: user?.id,
      });

      toast({
        title: `❌${t("toasts.wordsGenerateError")}`,
        variant: "error",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: aiKeys.usage() });
    },
  });

  return {
    generateEntries: generateEntriesMutation.mutateAsync,
    generateEntriesIsPending: generateEntriesMutation.isPending,
  };
};
