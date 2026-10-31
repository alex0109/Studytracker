export interface IStudyStreak {
  currentStreakDays: number;
  longestStreakDays: number;
  // Days are counted in the user's time zone; an attempt or a flashcard review makes a day
  studiedToday: boolean;
  // Last 14 days, oldest first, the last one is today
  recentDays: boolean[];
  // Same days: missed, but a streak freeze kept the streak going
  recentFrozenDays?: boolean[];
  freezesLeft?: number;
  freezesPerMonth?: number;
  // With a goal a day counts once this many reviews are done
  dailyGoal?: number | null;
  reviewsToday?: number;
}
