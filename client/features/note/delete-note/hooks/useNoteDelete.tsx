"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context";
import { logExceptionError } from "@/shared/lib";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { deleteNote, notesKeys } from "@/entities/note";
import { materialKeys } from "@/entities/material";
import { questionKeys } from "@/entities/question";
import { reviewKeys } from "@/entities/review";

export const useNoteDelete = (materialId: string, noteId: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const deleteNoteMutation = useMutation({
    mutationFn: () => deleteNote(token, materialId, noteId),
    onSuccess: () => {
      // What "Today" waits for changed: its queue, the reminder and the count in the menu
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
      // Its questions went with it: the material's question lists and counts change too
      queryClient.invalidateQueries({ queryKey: questionKeys.list(materialId) });
      queryClient.invalidateQueries({ queryKey: materialKeys.list() });

      toast({
        title: `✅${t("toasts.noteDeleted")}`,
        variant: "success",
      });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `materials/${materialId}/notes/${noteId} (delete)`,
        userID: user?.id,
      });

      toast({
        title: `❌${t("toasts.noteDeleteError")}`,
        variant: "error",
      });
    },
  });

  return {
    deleteNote: deleteNoteMutation.mutate,
    deleteNoteIsPending: deleteNoteMutation.isPending,
  };
};
