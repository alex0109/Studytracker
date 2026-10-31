"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { IDictionaryResponse } from "../model";
import { dictionaryKeys } from "../lib";
import { getDictionary } from "../api";

export const useDictionaryExact = (dictionaryId: string) => {
  const { token, user } = useSession();

  const exactDictionary = useQuery<IDictionaryResponse, Error>({
    queryKey: dictionaryKeys.detail(dictionaryId),
    queryFn: () => getDictionary(token, dictionaryId),
    enabled: !!dictionaryId && !!token,
  });

  useEffect(() => {
    if (exactDictionary.error) {
      logExceptionError(exactDictionary.error, {
        section: `dictionaries/${dictionaryId}`,
        userID: user?.id,
      });
    }
  }, [dictionaryId, exactDictionary.error, user?.id]);

  return {
    exactDictionaryData: exactDictionary.data,
    exactDictionaryIsPending: exactDictionary.isPending,
    exactDictionaryError: exactDictionary.error,
  };
};
