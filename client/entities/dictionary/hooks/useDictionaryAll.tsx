"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { IDictionaryResponse } from "../model";
import { dictionaryKeys } from "../lib";
import { getAllDictionaries } from "../api";

export const useDictionaryAll = (materialId: string, enabled = true) => {
  const { token, user } = useSession();

  const dictionaries = useQuery<IDictionaryResponse[], Error>({
    queryKey: dictionaryKeys.list(materialId),
    queryFn: () => getAllDictionaries(token, materialId),
    enabled: enabled && !!materialId && !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (dictionaries.error) {
      logExceptionError(dictionaries.error, {
        section: `dictionaries/materials/${materialId}`,
        userID: user?.id,
      });
    }
  }, [dictionaries.error]);

  return {
    dictionariesData: dictionaries.data,
    dictionariesIsPending: dictionaries.isPending,
    dictionariesError: dictionaries.error,
  };
};
