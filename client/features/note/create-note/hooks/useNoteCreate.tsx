"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context";
import { logExceptionError, getLimitErrorMessage } from "@/shared/lib";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { createNote, INoteCreate, notesKeys } from "@/entities/note";
import { materialKeys } from "@/entities/material";

export const useNoteCreate = (materialId: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const createNoteMutation = useMutation({
    mutationFn: (body: INoteCreate) => createNote(token, materialId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: materialKeys.list() });

      toast({
        title: `🎉${t("toasts.noteCreated")}`,
        variant: "success",
      });
    },
    onError: (error) => {
      // Limit reached: show why and refresh the counter, this is not a bug to report
      const limitMessage = getLimitErrorMessage(error, t);
      if (limitMessage) {
        queryClient.invalidateQueries({ queryKey: materialKeys.list() });
        toast({ title: `⚠️${limitMessage}`, variant: "error" });
        return;
      }

      logExceptionError(error, {
        section: "notes/ (create)",
        userID: user?.id,
      });

      toast({
        title: `❌${t("toasts.noteCreateError")}`,
        variant: "error",
      });
    },
  });

  return {
    createNote: createNoteMutation.mutate,
    createNoteIsPending: createNoteMutation.isPending,
  };
};
