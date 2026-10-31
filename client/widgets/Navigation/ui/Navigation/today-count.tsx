"use client";

import { FC } from "react";
import { useReviewToday } from "@/entities/review";

// How much is due today, next to the "Today" link; nothing when the queue is empty
export const TodayCount: FC = () => {
  const { todayData } = useReviewToday();
  const count = (todayData?.dueWords ?? 0) + (todayData?.dueQuestions ?? 0);

  if (count === 0) return null;

  return (
    <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1.5 text-[0.7rem] leading-5 font-semibold text-white tabular-nums">
      {count > 99 ? "99+" : count}
    </span>
  );
};
