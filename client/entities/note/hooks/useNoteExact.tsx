"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { INoteResponse } from "../model";
import { notesKeys } from "../lib";
import { getNote } from "../api/getNote";

export const useNoteExact = (materialId: string, noteId: string) => {
  const { token, user } = useSession();

  const exactNote = useQuery<INoteResponse, Error>({
    queryKey: notesKeys.detail(noteId),
    queryFn: () => getNote(token, materialId, noteId),
    enabled: !!materialId && !!noteId && !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (exactNote.error) {
      logExceptionError(exactNote.error, {
        section: `notes/${noteId}`,
        userID: user?.id,
      });
    }
  }, [exactNote.error]);

  return {
    exactNoteData: exactNote.data,
    exactNoteIsPending: exactNote.isPending,
    exactNoteError: exactNote.error,
  };
};
