"use client";

import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import {
  createDictionary,
  createDictionaryEntry,
  dictionaryKeys,
  IDictionaryEntryCreate,
  lookupDictionaryEntry,
  updateDictionaryEntry,
} from "@/entities/dictionary";
import { aiKeys, getAiErrorMessage } from "@/entities/ai";
import { trackEvent } from "@/shared/lib/analytics";

// Id of the word that already has this term, from the 409 answer
export const existingEntryIdOf = (error: unknown): string | null =>
  axios.isAxiosError(error) && error.response?.status === 409
    ? ((error.response.data?.existingEntryId as string | undefined) ?? null)
    : null;

export const useWordLookup = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const mutation = useMutation({
    mutationFn: ({ dictionaryId, term, sentence }: { dictionaryId: string; term: string; sentence?: string }) =>
      lookupDictionaryEntry(token, dictionaryId, { term, sentence }),
    // The counter of AI requests moved
    onSettled: () => queryClient.invalidateQueries({ queryKey: aiKeys.usage() }),
    onError: (error) => {
      const message = getAiErrorMessage(error, t);
      if (!message) logExceptionError(error, { section: "dictionaries/entries/lookup", userID: user?.id });
      toast({ title: `⚠️${message ?? t("dictionary.fromReading.lookupError")}`, variant: "error" });
    },
  });

  return { lookup: mutation.mutateAsync, lookupIsPending: mutation.isPending };
};

export const useAddWord = (materialId: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const refresh = (dictionaryId: string) => {
    queryClient.invalidateQueries({ queryKey: dictionaryKeys.list(materialId) });
    queryClient.invalidateQueries({ queryKey: dictionaryKeys.detail(dictionaryId) });
  };

  const report = (section: string) => (error: unknown) => {
    // A duplicate is answered in the panel, not with a toast
    if (existingEntryIdOf(error)) return;
    const limit = axios.isAxiosError(error) && error.response?.status === 409;
    if (!limit) logExceptionError(error, { section, userID: user?.id });
    toast({ title: `⚠️${limit ? t("dictionary.fromReading.limit") : t("dictionary.fromReading.error")}`, variant: "error" });
  };

  const create = useMutation({
    mutationFn: ({ dictionaryId, body }: { dictionaryId: string; body: IDictionaryEntryCreate }) =>
      createDictionaryEntry(token, dictionaryId, body),
    onSuccess: (_, { dictionaryId }) => {
      refresh(dictionaryId);
      trackEvent("add_word_from_text");
    },
    onError: report("dictionaries/entries (from reading)"),
  });

  const updateExample = useMutation({
    mutationFn: ({ entryId, example, exampleTranslation }: { entryId: string; dictionaryId: string; example: string; exampleTranslation?: string }) =>
      updateDictionaryEntry(token, entryId, { example, exampleTranslation }),
    onSuccess: (_, { dictionaryId }) => refresh(dictionaryId),
    onError: report("dictionaries/entries (update example)"),
  });

  const createList = useMutation({
    mutationFn: (title: string) => createDictionary(token, materialId, { title }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: dictionaryKeys.list(materialId) }),
    onError: report("dictionaries (from reading)"),
  });

  return {
    createEntry: create.mutateAsync,
    updateExample: updateExample.mutateAsync,
    createDictionary: createList.mutateAsync,
    isPending: create.isPending || updateExample.isPending || createList.isPending,
  };
};
