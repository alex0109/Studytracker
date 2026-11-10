export interface IWordUsageExample {
  // In the language of the word
  sentence: string;
  translation: string;
  // Where you would say it
  situation: string;
}

// Everyday use of a dictionary word; shown once, never saved
export interface IWordExplanation {
  term: string;
  meaning: string;
  examples: IWordUsageExample[];
  collocations: string[];
  tip?: string | null;
}
