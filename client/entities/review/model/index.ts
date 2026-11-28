import type { IOption, QuestionTypeEnum } from "@/entities/question/@x/review";

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

// The answers of one local day, from "Today" and finished attempts
export interface IReviewDay {
  // "yyyy-MM-dd" in the user's own calendar
  date: string;
  reviews: number;
  // Answered "know" or right
  remembered: number;
  // 0-100
  accuracy: number;
  words: number;
  questions: number;
}

export interface IReviewDaySummary {
  today: IReviewDay;
  // The last day before today with any reviews; none on the first day
  previous?: IReviewDay | null;
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
  // The AI answer check's quota is used up: the plain check decided
  smartCheckLimitReached?: boolean;
  score: number;
  method: string;
  rating: string;
  correctAnswer?: string | null;
  correctOptionIds: string[];
  explanation?: string | null;
  state: "New" | "Learning" | "Review" | "Relearning";
  nextDue: string;
}
