export type DeadlinePace = "Empty" | "Ready" | "OnTrack" | "Tight" | "Passed";

// What is left before a deadline and how much of it to do today
export interface IDeadlinePlan {
  materialId: string;
  title: string;
  // "yyyy-MM-dd" in the user's own calendar
  deadline: string;
  // 0 means the date is today, negative that it has passed
  daysLeft: number;
  pace: DeadlinePace;
  totalWords: number;
  newWords: number;
  dueWords: number;
  weakWords: number;
  totalQuestions: number;
  newQuestions: number;
  dueQuestions: number;
  weakQuestions: number;
  newWordsToday: number;
  newQuestionsToday: number;
  reviewsPerDay: number;
  minutesToday: number;
  attemptRecommended: boolean;
}
