import type { IOption, QuestionTypeEnum } from "@/entities/question";

// Same shapes as the backend "Today" queue
export interface IDictionaryDueToday {
  dictionaryId: string;
  materialId: string;
  title: string;
  due: number;
  new: number;
}

export interface IMaterialDueToday {
  materialId: string;
  title: string;
  due: number;
}

export interface IReviewToday {
  localDate: string;
  dueWords: number;
  newWords: number;
  dueQuestions: number;
  overdueWords: number;
  overdueQuestions: number;
  wordsInSession: number;
  questionsInSession: number;
  estimatedMinutes: number;
  dictionaries: IDictionaryDueToday[];
  materials: IMaterialDueToday[];
  // Reviews done today, attempt answers included
  reviewsDone?: number;
  dailyGoal?: number | null;
  // What the user's daily limits still allow; null is no limit
  newWordsLeft?: number | null;
  reviewsLeft?: number | null;
}

export interface IReviewQuestion {
  id: string;
  materialId: string;
  materialTitle: string;
  title: string;
  questionType: QuestionTypeEnum;
  options: IOption[];
}

export interface IQuestionReviewSession {
  id: string;
  questions: IReviewQuestion[];
  startedAt: string;
  finishedAt?: string | null;
}

export interface IReviewAnswerResult {
  questionId: string;
  isCorrect: boolean;
  score: number;
  method: string;
  rating: string;
  correctAnswer?: string | null;
  correctOptionIds: string[];
  explanation?: string | null;
  state: "New" | "Learning" | "Review" | "Relearning";
  nextDue: string;
}
