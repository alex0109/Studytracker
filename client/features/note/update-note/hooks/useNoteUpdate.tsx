"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context";
import { logExceptionError } from "@/shared/lib";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { INoteUpdate, updateNote, notesKeys } from "@/entities/note";
import { IMaterialResponse, materialKeys } from "@/entities/material";

export const useNoteUpdate = (noteId: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const updateNoteMutation = useMutation({
    mutationKey: notesKeys.update(noteId),
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
