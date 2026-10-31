import { useTranslation } from "react-i18next";
import { IDictionaryEntryResponse, PartOfSpeechEnum } from "@/entities/dictionary";

const base = {
  dictionaryId: "landing",
  synonyms: [],
  isArchived: false,
  createdAt: new Date(0),
  updatedAt: new Date(0),
};

// Sample German words for landing demos, shaped like real dictionary entries;
// translations follow the language of the page
export const useSampleEntries = (): IDictionaryEntryResponse[] => {
  const { t } = useTranslation();

  return [
    {
      ...base,
      id: "schmetterling",
      position: 0,
      term: "Schmetterling",
      translation: t("landing.samples.butterfly.translation"),
      transcription: "[ˈʃmɛtɐlɪŋ]",
      partOfSpeech: PartOfSpeechEnum.Noun,
      grammarInfo: t("landing.samples.butterfly.grammar"),
      example: "Ein Schmetterling sitzt auf der Blume.",
      exampleTranslation: t("landing.samples.butterfly.example"),
    },
    {
      ...base,
      id: "gemuetlich",
      position: 1,
      term: "gemütlich",
      translation: t("landing.samples.cozy.translation"),
      transcription: "[ɡəˈmyːtlɪç]",
      partOfSpeech: PartOfSpeechEnum.Adjective,
      example: "Das Café ist sehr gemütlich.",
      exampleTranslation: t("landing.samples.cozy.example"),
      synonyms: ["behaglich", "heimelig"],
    },
    {
      ...base,
      id: "laufen",
      position: 2,
      term: "laufen",
      translation: t("landing.samples.run.translation"),
      transcription: "[ˈlaʊ̯fn̩]",
      partOfSpeech: PartOfSpeechEnum.Verb,
      grammarInfo: "läuft, lief, ist gelaufen",
      example: "Ich laufe jeden Morgen im Park.",
      exampleTranslation: t("landing.samples.run.example"),
    },
  ];
};
