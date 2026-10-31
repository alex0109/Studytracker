"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { INoteUpdate } from "@/entities/note/model";
import { updateNote } from "@/entities/note/api/updateNote";
import { notesKeys } from "@/entities/note/lib";
import { IMaterialResponse, materialKeys } from "@/entities/material";

export const useNoteUpdate = (noteId: string) => {
  const { t } = useTranslation();
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
    // The answer is the saved note, so nothing is refetched while typing or drawing;
    // the list only shows note titles
    onSuccess: (updated, { materialId, dataToUpdate }) => {
      queryClient.setQueryData(notesKeys.detail(noteId), updated);

      if (dataToUpdate.title !== undefined) {
        queryClient.setQueryData<IMaterialResponse[]>(materialKeys.list(), (list) =>
          list?.map((material) =>
            material.id === materialId
              ? {
                  ...material,
                  notes: material.notes?.map((note) =>
                    note.id === noteId
                      ? { ...note, title: updated.title, updatedAt: updated.updatedAt }
                      : note,
                  ),
                }
              : material,
          ),
        );
        queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
      }
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `notes/${noteId} (update)`,
        userID: user?.id,
      });

      toast({
        title: `❌${t("toasts.noteUpdateError")}`,
        variant: "error",
      });
    },
  });

  return {
    updateNote: updateNoteMutation.mutate,
    updateNoteIsPending: updateNoteMutation.isPending,
    updateNoteIsError: updateNoteMutation.isError,
  };
};
