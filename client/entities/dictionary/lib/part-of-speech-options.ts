import { PartOfSpeechEnum } from "../model";

// Labels are translation keys under "dictionary.partOfSpeech". No "article": it is a field of a noun,
// not a word of its own; older words that have it keep it
export const partOfSpeechOptions: PartOfSpeechEnum[] = [
  PartOfSpeechEnum.Noun,
  PartOfSpeechEnum.Pronoun,
  PartOfSpeechEnum.Verb,
  PartOfSpeechEnum.Adjective,
  PartOfSpeechEnum.Adverb,
  PartOfSpeechEnum.Preposition,
  PartOfSpeechEnum.Conjunction,
  PartOfSpeechEnum.Interjection,
  PartOfSpeechEnum.Phrase,
  PartOfSpeechEnum.Numeral,
  PartOfSpeechEnum.Determiner,
];
