"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { IFlashcardSessionSummary } from "../model";
import { flashcardKeys } from "../lib";
import { getFlashcardSession } from "../api";

export const useFlashcardSession = (sessionId: string) => {
  const { token, user } = useSession();

  const session = useQuery<IFlashcardSessionSummary, Error>({
    queryKey: flashcardKeys.session(sessionId),
    queryFn: () => getFlashcardSession(token, sessionId),
    enabled: !!sessionId && !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (session.error) {
      logExceptionError(session.error, {
        section: `dictionaries/flashcards/sessions/${sessionId}`,
        userID: user?.id,
      });
    }
  }, [session.error, sessionId, user?.id]);

  return {
    flashcardSessionData: session.data,
    flashcardSessionIsPending: session.isPending,
    flashcardSessionError: session.error,
  };
};
