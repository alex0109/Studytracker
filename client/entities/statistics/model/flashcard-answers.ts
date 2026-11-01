// The three buttons of a flashcard: "know", "unsure", "don't know"
export interface IFlashcardAnswerCounts {
  know: number;
  unsure: number;
  dontKnow: number;
}

// "yyyy-MM-dd" in the user's own calendar
export interface IFlashcardAnswersDay extends IFlashcardAnswerCounts {
  date: string;
}

export interface IHardWord {
  entryId: string;
  term: string;
  translation: string;
  dontKnow: number;
  answers: number;
}

export interface IFlashcardAnswers extends IFlashcardAnswerCounts {
  // Every day of the window, oldest first, days without answers included
  days: IFlashcardAnswersDay[];
  hardestWords: IHardWord[];
}
