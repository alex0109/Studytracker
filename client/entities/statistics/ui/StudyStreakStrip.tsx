"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { useStatisticsStudyStreak } from "../hooks";
import { AnimatedNumber, Card, CardSkeleton } from "./primitives";

const DAYS = 14;

export function StudyStreakStrip() {
  const { statisticsStudyStreakData, statisticsStudyStreakIsPending } =
    useStatisticsStudyStreak();

  if (statisticsStudyStreakIsPending || !statisticsStudyStreakData) {
    return <CardSkeleton className="h-36 md:col-span-2" />;
  }

  const { currentStreakDays, longestStreakDays } = statisticsStudyStreakData;
  const dots = Array.from({ length: DAYS }, (_, i) => i < currentStreakDays);
  const active = currentStreakDays > 0;

  return (
    <Card className="md:col-span-2">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
              active
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-neutral-800 text-neutral-500"
            }`}
          >
            <Flame className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <p>
              <span className="text-3xl font-semibold tabular-nums text-neutral-50">
                <AnimatedNumber value={currentStreakDays} />
              </span>
              <span className="ml-2 text-neutral-500">
                day{currentStreakDays === 1 ? "" : "s"} in a row
              </span>
            </p>
            <p className="text-sm text-neutral-500">
              Longest streak: {longestStreakDays} day
              {longestStreakDays === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <div
          role="img"
          aria-label={`Last ${DAYS} days: ${Math.min(currentStreakDays, DAYS)} studied`}
          className="flex gap-1.5"
        >
          {dots.map((filled, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 18,
                delay: 0.3 + i * 0.03,
              }}
              className={`h-3.5 w-3.5 rounded-2xl border ${
                filled
                  ? "border-emerald-500 bg-emerald-500"
                  : "border-neutral-700"
              }`}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
