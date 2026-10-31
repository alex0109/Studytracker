"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { getLimitErrorMessage } from "@/shared/lib/limits";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { materialKeys } from "@/entities/material";
import { importLibraryItem, libraryKeys } from "@/entities/library";

export const useLibraryImport = (itemId: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const mutation = useMutation({
    mutationFn: () => importLibraryItem(token, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.list() });
      // "Already in your materials" and the import count
      queryClient.invalidateQueries({ queryKey: libraryKeys.detail(itemId) });
      queryClient.invalidateQueries({ queryKey: libraryKeys.lists() });

      toast({ title: `🎉${t("library.toasts.imported")}`, variant: "success" });
    },
    onError: (error) => {
      const limitMessage = getLimitErrorMessage(error, t);
      if (limitMessage) {
        toast({ title: `⚠️${limitMessage}`, variant: "error" });
        return;
      }

      logExceptionError(error, { section: `library/${itemId}/import`, userID: user?.id });
      toast({ title: `❌${t("library.toasts.importError")}`, variant: "error" });
    },
  });

  return {
    importLibraryItem: mutation.mutate,
    importLibraryItemIsPending: mutation.isPending,
  };
};
