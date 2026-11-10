"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { useTranslation } from "@/shared/i18n";
import { aiKeys, explainWord, getAiErrorMessage, IWordExplanation } from "@/entities/ai";

// Asked when the window opens, kept for the visit and never saved: the same word opened
// again shows the same examples without spending the quota, "more" asks for new ones
export const useWordExplanation = (entryId: string, enabled: boolean) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const query = useQuery<IWordExplanation, Error>({
    queryKey: aiKeys.wordExplanation(entryId),
    queryFn: () => explainWord(token, entryId),
    enabled: enabled && !!token,
    staleTime: Infinity,
    gcTime: 30 * 60_000,
    retry: false,
  });

  // Every answer, good or failed, changes what is left of the quota
  useEffect(() => {
    if (query.dataUpdatedAt || query.errorUpdatedAt) {
      queryClient.invalidateQueries({ queryKey: aiKeys.usage() });
    }
  }, [query.dataUpdatedAt, query.errorUpdatedAt, queryClient]);

  const knownError = query.error ? getAiErrorMessage(query.error, t) : null;

  useEffect(() => {
    if (query.error && !knownError) {
      logExceptionError(query.error, { section: `ai/dictionaries/entries/${entryId}/explanation`, userID: user?.id });
    }
  }, [query.error, knownError, entryId, user?.id]);

  return {
    explanation: query.data,
    explanationIsPending: query.isFetching,
    explanationError: query.error ? (knownError ?? t("dictionary.explain.error")) : null,
    explainAgain: () => query.refetch(),
  };
};
