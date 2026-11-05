import { PartOfSpeechEnum } from "@/entities/dictionary/model/part-of-speech.type";

// Page languages; a sample is never in one of them, or it would be "translated" into itself
type PageLanguage = "uk" | "en-GB" | "nb";
type Translated = Record<PageLanguage, string>;

export interface SampleWord {
  id: string;
  term: string;
  transcription: string;
  partOfSpeech: PartOfSpeechEnum;
  grammarInfo?: string;
  synonyms?: string[];
  example: string;
  translation: Translated;
  exampleTranslation: Translated;
}

// Words from many languages for the landing cards: a visitor sees what learning any language
// here looks like, not only German
export const SAMPLE_WORDS: SampleWord[] = [
  {
    id: "schmetterling",
    term: "Schmetterling",
    transcription: "[ˈʃmɛtɐlɪŋ]",
    partOfSpeech: PartOfSpeechEnum.Noun,
    grammarInfo: "der, die Schmetterlinge",
    example: "Ein Schmetterling sitzt auf der Blume.",
    translation: { uk: "метелик", "en-GB": "butterfly", nb: "sommerfugl" },
    exampleTranslation: {
      uk: "Метелик сидить на квітці.",
      "en-GB": "A butterfly is sitting on the flower.",
      nb: "En sommerfugl sitter på blomsten.",
    },
  },
  {
    id: "gemuetlich",
    term: "gemütlich",
    transcription: "[ɡəˈmyːtlɪç]",
    partOfSpeech: PartOfSpeechEnum.Adjective,
    synonyms: ["behaglich", "heimelig"],
    example: "Das Café ist sehr gemütlich.",
    translation: { uk: "затишний", "en-GB": "cosy", nb: "koselig" },
    exampleTranslation: {
      uk: "Кавʼярня дуже затишна.",
      "en-GB": "The café is very cosy.",
      nb: "Kafeen er veldig koselig.",
    },
  },
  {
    id: "laufen",
    term: "laufen",
    transcription: "[ˈlaʊ̯fn̩]",
    partOfSpeech: PartOfSpeechEnum.Verb,
    grammarInfo: "läuft, lief, ist gelaufen",
    example: "Ich laufe jeden Morgen im Park.",
    translation: { uk: "бігати", "en-GB": "to run", nb: "å løpe" },
    exampleTranslation: {
      uk: "Я бігаю щоранку в парку.",
      "en-GB": "I run in the park every morning.",
      nb: "Jeg løper i parken hver morgen.",
    },
  },
  {
    id: "bibliotheque",
    term: "la bibliothèque",
    transcription: "[bi.bli.jɔ.tɛk]",
    partOfSpeech: PartOfSpeechEnum.Noun,
    grammarInfo: "f., les bibliothèques",
    example: "Je lis à la bibliothèque le samedi.",
    translation: { uk: "бібліотека", "en-GB": "library", nb: "bibliotek" },
    exampleTranslation: {
      uk: "Я читаю в бібліотеці по суботах.",
      "en-GB": "I read at the library on Saturdays.",
      nb: "Jeg leser på biblioteket på lørdager.",
    },
  },
  {
    id: "flaner",
    term: "flâner",
    transcription: "[flɑ.ne]",
    partOfSpeech: PartOfSpeechEnum.Verb,
    example: "Nous aimons flâner le long de la Seine.",
    translation: { uk: "неквапом гуляти", "en-GB": "to stroll", nb: "å spasere" },
    exampleTranslation: {
      uk: "Ми любимо неквапом гуляти вздовж Сени.",
      "en-GB": "We love strolling along the Seine.",
      nb: "Vi elsker å spasere langs Seinen.",
    },
  },
  {
    id: "madrugar",
    term: "madrugar",
    transcription: "[ma.ðɾuˈɣaɾ]",
    partOfSpeech: PartOfSpeechEnum.Verb,
    example: "Mañana tengo que madrugar.",
    translation: { uk: "рано вставати", "en-GB": "to get up early", nb: "å stå opp tidlig" },
    exampleTranslation: {
      uk: "Завтра мені треба рано вставати.",
      "en-GB": "I have to get up early tomorrow.",
      nb: "I morgen må jeg stå opp tidlig.",
    },
  },
  {
    id: "sobremesa",
    term: "la sobremesa",
    transcription: "[so.βɾeˈme.sa]",
    partOfSpeech: PartOfSpeechEnum.Noun,
    grammarInfo: "f.",
    example: "La sobremesa duró dos horas.",
    translation: {
      uk: "розмова за столом після їжі",
      "en-GB": "chatting at the table after a meal",
      nb: "prat ved bordet etter maten",
    },
    exampleTranslation: {
      uk: "Розмова після обіду тривала дві години.",
      "en-GB": "The after-dinner chat lasted two hours.",
      nb: "Praten etter middagen varte i to timer.",
    },
  },
  {
    id: "pazienza",
    term: "la pazienza",
    transcription: "[patˈtsjɛn.tsa]",
    partOfSpeech: PartOfSpeechEnum.Noun,
    grammarInfo: "f.",
    example: "Ci vuole pazienza per imparare una lingua.",
    translation: { uk: "терпіння", "en-GB": "patience", nb: "tålmodighet" },
    exampleTranslation: {
      uk: "Щоб вивчити мову, потрібне терпіння.",
      "en-GB": "Learning a language takes patience.",
      nb: "Det krever tålmodighet å lære et språk.",
    },
  },
  {
    id: "komorebi",
    term: "木漏れ日",
    transcription: "komorebi",
    partOfSpeech: PartOfSpeechEnum.Noun,
    example: "公園の木漏れ日がきれいだった。",
    translation: {
      uk: "сонячне світло крізь листя",
      "en-GB": "sunlight through the leaves",
      nb: "sollys gjennom løvet",
    },
    exampleTranslation: {
      uk: "Світло крізь листя в парку було гарним.",
      "en-GB": "The sunlight through the leaves in the park was beautiful.",
      nb: "Sollyset gjennom løvet i parken var vakkert.",
    },
  },
  {
    id: "saudade",
    term: "a saudade",
    transcription: "[sawˈða.dʒi]",
    partOfSpeech: PartOfSpeechEnum.Noun,
    grammarInfo: "f.",
    example: "Sinto saudade da minha cidade.",
    translation: { uk: "туга за кимось чи чимось", "en-GB": "longing", nb: "lengsel" },
    exampleTranslation: {
      uk: "Я сумую за своїм містом.",
      "en-GB": "I miss my hometown.",
      nb: "Jeg savner byen min.",
    },
  },
  {
    id: "fika",
    term: "fika",
    transcription: "[ˈfiː.ka]",
    partOfSpeech: PartOfSpeechEnum.Noun,
    example: "Ska vi ta en fika?",
    translation: { uk: "перерва на каву", "en-GB": "coffee break", nb: "kaffepause" },
    exampleTranslation: {
      uk: "Може, зробимо перерву на каву?",
      "en-GB": "Shall we have a coffee break?",
      nb: "Skal vi ta en kaffepause?",
    },
  },
  {
    id: "pyszny",
    term: "pyszny",
    transcription: "[ˈpɨʂ.nɨ]",
    partOfSpeech: PartOfSpeechEnum.Adjective,
    example: "Ta zupa jest pyszna!",
    translation: { uk: "смачний", "en-GB": "delicious", nb: "deilig" },
    exampleTranslation: {
      uk: "Цей суп смачний!",
      "en-GB": "This soup is delicious!",
      nb: "Denne suppen er deilig!",
    },
  },
  {
    id: "gezellig",
    term: "gezellig",
    transcription: "[ɣəˈzɛ.ləx]",
    partOfSpeech: PartOfSpeechEnum.Adjective,
    example: "Het was een gezellige avond.",
    translation: { uk: "затишний, приємний", "en-GB": "cosy, convivial", nb: "koselig" },
    exampleTranslation: {
      uk: "Це був приємний вечір.",
      "en-GB": "It was a lovely evening.",
      nb: "Det var en koselig kveld.",
    },
  },
  {
    id: "gamsahada",
    term: "감사하다",
    transcription: "gamsahada",
    partOfSpeech: PartOfSpeechEnum.Verb,
    example: "도와줘서 정말 감사합니다.",
    translation: { uk: "дякувати", "en-GB": "to thank", nb: "å takke" },
    exampleTranslation: {
      uk: "Щиро дякую за допомогу.",
      "en-GB": "Thank you so much for your help.",
      nb: "Tusen takk for hjelpen.",
    },
  },
];

export const SAMPLE_DECK_SIZE = 5;

// Picked on the server for every request and handed to the page, so a reload brings new words
// and the server HTML and the browser agree on which ones
export const pickSampleWordIds = (count = SAMPLE_DECK_SIZE) => {
  const ids = SAMPLE_WORDS.map((word) => word.id);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids.slice(0, count);
};
