export interface IStudyStreak {
  currentStreakDays: number;
  longestStreakDays: number;
  // Days are counted in the user's time zone; an attempt or a flashcard review makes a day
  studiedToday: boolean;
  // Last 14 days, oldest first, the last one is today
  recentDays: boolean[];
}
