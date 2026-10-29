"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { deleteDictionary, dictionaryKeys } from "@/entities/dictionary";

export const useDictionaryDelete = (materialId: string, dictionaryId: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const deleteDictionaryMutation = useMutation({
    mutationFn: () => deleteDictionary(token, dictionaryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dictionaryKeys.list(materialId),
      });

      toast({
        title: `✅${t("toasts.dictionaryDeleted")}`,
        variant: "success",
      });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `dictionaries/${dictionaryId} (delete)`,
        userID: user?.id,
      });

      toast({
        title: `❌${t("toasts.dictionaryDeleteError")}`,
        variant: "error",
      });
    },
  });

  return {
    deleteDictionary: deleteDictionaryMutation.mutate,
    deleteDictionaryIsPending: deleteDictionaryMutation.isPending,
  };
};
