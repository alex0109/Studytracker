import {
  IDictionaryEntryCreate,
  IDictionaryEntryForm,
  IDictionaryEntryResponse,
  IDictionaryEntryUpdate,
  PartOfSpeechEnum,
} from "../model";

const parseSynonyms = (synonyms?: string): string[] =>
  (synonyms ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

// The field stays in the form when the part of speech changes, but only a noun keeps it
const articleOf = (values: IDictionaryEntryForm) =>
  values.partOfSpeech === PartOfSpeechEnum.Noun ? values.article?.trim() ?? "" : "";

export const toEntryCreate = (
  values: IDictionaryEntryForm,
): IDictionaryEntryCreate => ({
  term: values.term.trim(),
  translation: values.translation.trim(),
  transcription: values.transcription?.trim() || undefined,
  partOfSpeech: values.partOfSpeech || undefined,
  article: articleOf(values) || undefined,
  grammarInfo: values.grammarInfo?.trim() || undefined,
  example: values.example?.trim() || undefined,
  exampleTranslation: values.exampleTranslation?.trim() || undefined,
  note: values.note?.trim() || undefined,
  synonyms: parseSynonyms(values.synonyms),
});

// Backend skips null fields on update, so empty strings are sent to clear them
export const toEntryUpdate = (
  values: IDictionaryEntryForm,
): IDictionaryEntryUpdate => ({
  term: values.term.trim(),
  translation: values.translation.trim(),
  transcription: values.transcription?.trim() ?? "",
  partOfSpeech: values.partOfSpeech || undefined,
  article: articleOf(values),
  grammarInfo: values.grammarInfo?.trim() ?? "",
  example: values.example?.trim() ?? "",
  exampleTranslation: values.exampleTranslation?.trim() ?? "",
  note: values.note?.trim() ?? "",
  synonyms: parseSynonyms(values.synonyms),
});

export const toEntryForm = (
  entry: IDictionaryEntryResponse,
): IDictionaryEntryForm => ({
  term: entry.term,
  translation: entry.translation,
  transcription: entry.transcription ?? "",
  partOfSpeech: entry.partOfSpeech ?? "",
  article: entry.article ?? "",
  grammarInfo: entry.grammarInfo ?? "",
  example: entry.example ?? "",
  exampleTranslation: entry.exampleTranslation ?? "",
  note: entry.note ?? "",
  synonyms: entry.synonyms.join(", "),
});
