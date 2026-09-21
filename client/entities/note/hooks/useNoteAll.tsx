"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { INoteResponse } from "../model";
import { notesKeys } from "../lib";
import { getAllNotes } from "../api/getAllNotes";

export const useNotesAll = (materialId: string) => {
  const { token, user } = useSession();

  const notes = useQuery<INoteResponse[]>({
    queryKey: notesKeys.all,
    queryFn: () => getAllNotes(token, materialId),
    enabled: !!materialId && !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (notes.error) {
      logExceptionError(notes.error, {
        section: "notes",
        userID: user?.id,
      });
    }
  }, [notes.error]);

  return {
    notesData: notes.data,
    notesIsPending: notes.isPending,
    notesError: notes.error,
  };
};
