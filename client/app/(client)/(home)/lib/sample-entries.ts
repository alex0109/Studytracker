import { IDictionaryEntryResponse, PartOfSpeechEnum } from "@/entities/dictionary";

const base = {
  dictionaryId: "landing",
  synonyms: [],
  isArchived: false,
  createdAt: new Date(0),
  updatedAt: new Date(0),
};

// Sample words for landing demos, shaped like real dictionary entries
export const sampleEntries: IDictionaryEntryResponse[] = [
  {
    ...base,
    id: "schmetterling",
    position: 0,
    term: "Schmetterling",
    translation: "butterfly",
    transcription: "[ˈʃmɛtɐlɪŋ]",
    partOfSpeech: PartOfSpeechEnum.Noun,
    grammarInfo: "der, plural: die Schmetterlinge",
    example: "Ein Schmetterling sitzt auf der Blume.",
    exampleTranslation: "A butterfly is sitting on the flower.",
  },
  {
    ...base,
    id: "gemuetlich",
    position: 1,
    term: "gemütlich",
    translation: "cozy",
    transcription: "[ɡəˈmyːtlɪç]",
    partOfSpeech: PartOfSpeechEnum.Adjective,
    example: "Das Café ist sehr gemütlich.",
    exampleTranslation: "The café is very cozy.",
    synonyms: ["behaglich", "heimelig"],
  },
  {
    ...base,
    id: "laufen",
    position: 2,
    term: "laufen",
    translation: "to run, to walk",
    transcription: "[ˈlaʊ̯fn̩]",
    partOfSpeech: PartOfSpeechEnum.Verb,
    grammarInfo: "läuft, lief, ist gelaufen",
    example: "Ich laufe jeden Morgen im Park.",
    exampleTranslation: "I run in the park every morning.",
  },
];
