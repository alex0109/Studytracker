"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { INoteUpdate } from "@/entities/note/model";
import { updateNote } from "@/entities/note/api/updateNote";
import { notesKeys } from "@/entities/note/lib";
import { materialKeys } from "@/entities/material";

export const useNoteUpdate = (noteId: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const updateNoteMutation = useMutation({
    mutationFn: ({
      materialId,
      noteId,
      dataToUpdate,
    }: {
      materialId: string;
      noteId: string;
      dataToUpdate: INoteUpdate;
    }) => updateNote(token, materialId, noteId, dataToUpdate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesKeys.detail(noteId) });
      queryClient.invalidateQueries({ queryKey: notesKeys.all });
      queryClient.invalidateQueries({ queryKey: materialKeys.all });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `notes/${noteId} (update)`,
        userID: user?.id,
      });

      toast({
        title: "❌Error occured while updating note",
        variant: "error",
      });
    },
  });

  return {
    updateNote: updateNoteMutation.mutate,
    updateNoteIsPending: updateNoteMutation.isPending,
  };
};
