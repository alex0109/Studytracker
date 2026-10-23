import { PartOfSpeechEnum } from "../model";

export const partOfSpeechOptions: { value: PartOfSpeechEnum; label: string }[] =
  [
    { value: PartOfSpeechEnum.Noun, label: "Noun" },
    { value: PartOfSpeechEnum.Pronoun, label: "Pronoun" },
    { value: PartOfSpeechEnum.Verb, label: "Verb" },
    { value: PartOfSpeechEnum.Adjective, label: "Adjective" },
    { value: PartOfSpeechEnum.Adverb, label: "Adverb" },
    { value: PartOfSpeechEnum.Preposition, label: "Preposition" },
    { value: PartOfSpeechEnum.Conjunction, label: "Conjunction" },
    { value: PartOfSpeechEnum.Interjection, label: "Interjection" },
  ];
