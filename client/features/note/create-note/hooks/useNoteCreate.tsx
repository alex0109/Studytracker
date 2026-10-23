"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { getLimitErrorMessage } from "@/shared/lib/limits";
import { toast } from "@/shared/radix-ui";
import { createNote } from "@/entities/note/api/createNote";
import { INoteCreate } from "@/entities/note/model";
import { notesKeys } from "@/entities/note/lib";
import { materialKeys } from "@/entities/material";

export const useNoteCreate = (materialId: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const createNoteMutation = useMutation({
    mutationFn: (body: INoteCreate) => createNote(token, materialId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesKeys.all });
      queryClient.invalidateQueries({ queryKey: materialKeys.all });

      toast({
        title: "🎉Note has been created!",
        variant: "success",
      });
    },
    onError: (error) => {
      // Limit reached: show why and refresh the counter, this is not a bug to report
      const limitMessage = getLimitErrorMessage(error);
      if (limitMessage) {
        queryClient.invalidateQueries({ queryKey: materialKeys.all });
        toast({ title: `⚠️${limitMessage}`, variant: "error" });
        return;
      }

      logExceptionError(error, {
        section: "notes/ (create)",
        userID: user?.id,
      });

      toast({
        title: "❌Error occured while creating note",
        variant: "error",
      });
    },
  });

  return {
    createNote: createNoteMutation.mutate,
    createNoteIsPending: createNoteMutation.isPending,
  };
};
