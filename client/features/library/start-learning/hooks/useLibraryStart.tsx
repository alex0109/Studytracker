"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSession } from "@/shared/context";
import { logExceptionError, getLimitErrorMessage } from "@/shared/lib";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { materialKeys } from "@/entities/material";
import { libraryKeys, startLibraryItem } from "@/entities/library";
import { reviewKeys } from "@/entities/review";

// One click from the catalog to learning: the material is added once, then opened in "Materials"
export const useLibraryStart = (itemId: string) => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const mutation = useMutation({
    mutationFn: () => startLibraryItem(token, itemId),
    onSuccess: async ({ materialId, isNew }) => {
      // What "Today" waits for changed: its queue, the reminder and the count in the menu
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      if (isNew) {
        queryClient.invalidateQueries({ queryKey: libraryKeys.detail(itemId) });
        queryClient.invalidateQueries({ queryKey: libraryKeys.lists() });
        toast({ title: `🎉${t("library.toasts.imported")}`, variant: "success" });
      }
      // The list must hold the material before the page opens it
      await queryClient.invalidateQueries({ queryKey: materialKeys.list() });
      router.push(`/materials?material=${materialId}`);
    },
    onError: (error) => {
      const limitMessage = getLimitErrorMessage(error, t);
      if (limitMessage) {
        toast({ title: `⚠️${limitMessage}`, variant: "error" });
        return;
      }

      logExceptionError(error, { section: `library/${itemId}/start`, userID: user?.id });
      toast({ title: `❌${t("library.toasts.importError")}`, variant: "error" });
    },
  });

  return {
    startLearning: mutation.mutate,
    // Stays on while the page changes, so the button can't be pressed twice
    startLearningIsPending: mutation.isPending || mutation.isSuccess,
  };
};
