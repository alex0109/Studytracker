"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import {
  dictionaryKeys,
  IDictionaryResponse,
  reorderDictionaryEntries,
} from "@/entities/dictionary";

export const useDictionaryEntriesReorder = (dictionaryId: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const reorderEntriesMutation = useMutation({
    mutationFn: (entryIds: string[]) =>
      reorderDictionaryEntries(token, dictionaryId, { entryIds }),
    onMutate: async (entryIds) => {
      const queryKey = dictionaryKeys.detail(dictionaryId);
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<IDictionaryResponse>(queryKey);

      // Optimistic order, so the list does not jump back while request is pending
      if (previous?.entries) {
        const position = new Map(entryIds.map((id, index) => [id, index]));
        queryClient.setQueryData<IDictionaryResponse>(queryKey, {
          ...previous,
          entries: [...previous.entries]
            .map((entry) => ({
              ...entry,
              position: position.get(entry.id) ?? entry.position,
            }))
            .sort((a, b) => a.position - b.position),
        });
      }

      return { previous };
    },
    onError: (error, _, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          dictionaryKeys.detail(dictionaryId),
          context.previous,
        );
      }

      logExceptionError(error, {
        section: `dictionaries/${dictionaryId}/entries/reorder`,
        userID: user?.id,
      });

      toast({
        title: `❌${t("toasts.reorderError")}`,
        variant: "error",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: dictionaryKeys.detail(dictionaryId),
      });
    },
  });

  return {
    reorderEntries: reorderEntriesMutation.mutate,
    reorderEntriesIsPending: reorderEntriesMutation.isPending,
  };
};
