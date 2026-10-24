"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { dictionaryKeys } from "@/entities/dictionary";
import {
  aiKeys,
  generateDictionaryEntries,
  getAiErrorMessage,
  IDictionaryEntriesGenerate,
} from "@/entities/ai";

export const useDictionaryEntriesGenerate = (dictionaryId: string) => {
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
        title: `✨${entries.length} ${entries.length === 1 ? "word has" : "words have"} been added!`,
        variant: "success",
      });
    },
    onError: (error) => {
      // Quota, AI down or nothing to generate from: tell why, this is not a bug to report
      const aiMessage = getAiErrorMessage(error);
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
        title: "❌Error occurred while generating words",
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
