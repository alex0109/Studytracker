"use client";

import { motion } from "framer-motion";
import { Flame, Snowflake } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useStatisticsStudyStreak } from "../hooks";
import { AnimatedNumber, Card, CardSkeleton } from "./primitives";

export function StudyStreakStrip() {
  const { t } = useTranslation();
  const { statisticsStudyStreakData, statisticsStudyStreakIsPending } =
    useStatisticsStudyStreak();

  if (statisticsStudyStreakIsPending || !statisticsStudyStreakData) {
    return <CardSkeleton className="h-36 md:col-span-2" />;
  }

  const {
    currentStreakDays,
    longestStreakDays,
    studiedToday,
    recentDays,
    recentFrozenDays = [],
    freezesLeft = 0,
    freezesPerMonth = 0,
    dailyGoal,
    reviewsToday = 0,
  } = statisticsStudyStreakData;
  const active = currentStreakDays > 0;
  const studiedRecently = recentDays.filter(Boolean).length;

  return (
    <Card className="md:col-span-2">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
              active
                ? "bg-orange-500/10 text-orange-500"
                : "bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500"
            }`}
          >
            <Flame className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <p>
              <span className="text-3xl font-semibold tabular-nums text-neutral-900 dark:text-neutral-50">
                <AnimatedNumber value={currentStreakDays} />
              </span>
              <span className="ml-2 text-neutral-500">
                {t("statistics.streak.inARow", { count: currentStreakDays })}
              </span>
            </p>
            <p className="text-sm text-neutral-500">
              {t("statistics.streak.longest", { count: longestStreakDays })}
              {" · "}
              {dailyGoal
                ? t("statistics.streak.goal", { done: Math.min(reviewsToday, dailyGoal), goal: dailyGoal })
                : studiedToday
                  ? t("statistics.streak.todayDone")
                  : t("statistics.streak.todayNotYet")}
            </p>
            {freezesPerMonth > 0 && (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400">
                <Snowflake className="h-3.5 w-3.5" aria-hidden />
                {t("statistics.streak.freezes", { count: freezesLeft })}
              </p>
            )}
          </div>
        </div>

        {/* Real study days of the last two weeks, today is the last dot */}
        <div
          role="img"
          aria-label={t("statistics.streak.recent", {
            count: studiedRecently,
            days: recentDays.length,
          })}
          className="flex gap-1.5"
        >
          {recentDays.map((studied, i) =>
            recentFrozenDays[i] ? (
              // A missed day a freeze covered: the streak went on through it
              <motion.span
                key={i}
                title={t("statistics.streak.frozenDay")}
                initial={{ scale: 0, rotate: -90, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.3 + i * 0.03 }}
                className="flex h-3.5 w-3.5 items-center justify-center text-sky-500"
              >
                <Snowflake className="h-3.5 w-3.5" aria-hidden />
              </motion.span>
            ) : (
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
                studied
                  ? "border-emerald-500 bg-emerald-500"
                  : "border-neutral-300 dark:border-neutral-700"
              } ${i === recentDays.length - 1 ? "ring-2 ring-offset-2 ring-neutral-300 ring-offset-white dark:ring-neutral-600 dark:ring-offset-neutral-900" : ""}`}
            />
            ),
          )}
        </div>
      </div>
    </Card>
  );
}
