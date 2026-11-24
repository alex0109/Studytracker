// Same names as the backend enums
export type EssayCriterion = "TaskResponse" | "Coherence" | "Vocabulary" | "Grammar";

export type EssayCorrectionCategory =
  | "Grammar"
  | "Vocabulary"
  | "Spelling"
  | "Punctuation"
  | "Style";

export interface IEssayCriterionScore {
  criterion: EssayCriterion;
  score: number;
  comment: string;
  // IELTS checks only, 0-9
  band?: number | null;
}

export interface IEssayCorrection {
  // Copied from the essay as it was checked
  original: string;
  correction: string;
  explanation: string;
  category: EssayCorrectionCategory;
}

// The last AI check of an essay, 0-100. The overall score is the mean of the criteria
export interface IEssayReview {
  score: number;
  criteria: IEssayCriterionScore[];
  strengths: string[];
  improvements: string[];
  corrections: IEssayCorrection[];
  wordCount: number;
  // Very long essays are checked by their first part
  isTextTruncated: boolean;
  checkedAt: string;
  // Exam checks only: the format checked for and the estimate on the exam's scale ("6.5", "B1", "below_A2")
  format?: string | null;
  examResult?: string | null;
}
