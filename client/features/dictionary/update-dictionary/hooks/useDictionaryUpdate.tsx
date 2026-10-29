"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import {
  dictionaryKeys,
  IDictionaryUpdate,
  updateDictionary,
} from "@/entities/dictionary";

export const useDictionaryUpdate = (dictionaryId: string) => {
  const { t } = useTranslation();
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
        title: `❌${t("toasts.dictionaryUpdateError")}`,
        variant: "error",
      });
    },
  });

  return {
    updateDictionary: updateDictionaryMutation.mutate,
    updateDictionaryIsPending: updateDictionaryMutation.isPending,
    updateDictionaryIsError: updateDictionaryMutation.isError,
  };
};
