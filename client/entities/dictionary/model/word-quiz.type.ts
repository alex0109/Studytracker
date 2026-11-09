// A quick check after a forgotten word: a practice step, nothing is saved
export type WordQuizKind = "Translation" | "Synonym";

export interface IWordQuizOption {
  text: string;
  isCorrect: boolean;
}

export interface IWordQuiz {
  entryId: string;
  kind: WordQuizKind;
  term: string;
  article?: string | null;
  // In the order to show; empty when the user has no other words to mix in
  options: IWordQuizOption[];
}
