"use client";

import { createContext, createElement, ReactNode, useContext } from "react";
import { useTranslation } from "react-i18next";
import { IDictionaryEntryResponse } from "@/entities/dictionary";
import { SAMPLE_DECK_SIZE, SAMPLE_WORDS } from "./sample-words";

const base = {
  dictionaryId: "landing",
  isArchived: false,
  createdAt: new Date(0),
  updatedAt: new Date(0),
};

// Without a provider the deck is the first words, the same on the server and in the browser
const SampleWordsContext = createContext<string[]>(
  SAMPLE_WORDS.slice(0, SAMPLE_DECK_SIZE).map((word) => word.id),
);

// The page picks the words on the server and every landing card reads them from here
export const SampleWordsProvider = ({ ids, children }: { ids: string[]; children: ReactNode }) =>
  createElement(SampleWordsContext.Provider, { value: ids }, children);

// Sample words shaped like real dictionary entries; translations follow the language of the page
export const useSampleEntries = (): IDictionaryEntryResponse[] => {
  const { i18n } = useTranslation();
  const ids = useContext(SampleWordsContext);
  const language = (["uk", "en-GB", "nb"] as const).find((code) => code === i18n.language) ?? "en-GB";

  return ids.flatMap((id, position) => {
    const word = SAMPLE_WORDS.find((item) => item.id === id);
    if (!word) return [];

    return [
      {
        ...base,
        id: word.id,
        position,
        term: word.term,
        transcription: word.transcription,
        partOfSpeech: word.partOfSpeech,
        grammarInfo: word.grammarInfo,
        synonyms: word.synonyms ?? [],
        example: word.example,
        translation: word.translation[language],
        exampleTranslation: word.exampleTranslation[language],
      },
    ];
  });
};
