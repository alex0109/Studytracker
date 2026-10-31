"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { getNote } from "../api/getNote";
import { notesKeys } from "../lib";

// Starts loading a note's content on hover or focus, so it's usually there by the click
export const usePrefetchNote = () => {
  const queryClient = useQueryClient();
  const { token } = useSession();

  return (materialId: string, noteId: string) => {
    if (!token) return;

    void queryClient.prefetchQuery({
      queryKey: notesKeys.detail(noteId),
      queryFn: () => getNote(token, materialId, noteId),
      staleTime: 30_000,
    });
  };
};
