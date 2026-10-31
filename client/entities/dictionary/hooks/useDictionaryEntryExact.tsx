"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { IDictionaryEntryResponse } from "../model";
import { dictionaryKeys } from "../lib";
import { getDictionaryEntry } from "../api";

export const useDictionaryEntryExact = (entryId: string) => {
  const { token, user } = useSession();

  const exactEntry = useQuery<IDictionaryEntryResponse, Error>({
    queryKey: dictionaryKeys.entry(entryId),
    queryFn: () => getDictionaryEntry(token, entryId),
    enabled: !!entryId && !!token,
  });

  useEffect(() => {
    if (exactEntry.error) {
      logExceptionError(exactEntry.error, {
        section: `dictionaries/entries/${entryId}`,
        userID: user?.id,
      });
    }
  }, [entryId, exactEntry.error, user?.id]);

  return {
    exactEntryData: exactEntry.data,
    exactEntryIsPending: exactEntry.isPending,
    exactEntryError: exactEntry.error,
  };
};
