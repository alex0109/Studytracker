"use client";

import { useStatisticsStudyStreak } from "../hooks";

export function StudyStreakStrip() {
  const { statisticsStudyStreakData, statisticsStudyStreakIsPending } =
    useStatisticsStudyStreak();

  if (statisticsStudyStreakIsPending || !statisticsStudyStreakData) {
    return (
      <div className="h-40 animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900" />
    );
  }

  const { currentStreakDays, longestStreakDays } = statisticsStudyStreakData;
  const dots = Array.from({ length: 14 }, (_, i) => {
    const dayIndex = 13 - i;
    return dayIndex < currentStreakDays;
  });

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-900 p-6 sm:flex-row sm:items-center">
      <div className="p-5">
        <span className="text-4xl font-semibold text-neutral-50">
          {currentStreakDays}
        </span>
        <span className="ml-2 text-neutral-500">
          day{currentStreakDays === 1 ? "" : "s"} in a row
        </span>
        <p className="mt-1 font-mono text-xs text-neutral-500">
          longest streak {longestStreakDays} day
          {longestStreakDays === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mt-5 flex gap-1.5 sm:mt-0">
        {dots.map((filled, i) => (
          <span
            key={i}
            className={
              filled
                ? "h-3 w-3 rounded-full border border-neutral-200 bg-neutral-200"
                : "h-3 w-3 rounded-full border border-neutral-700"
            }
          />
        ))}
      </div>
    </div>
  );
}
