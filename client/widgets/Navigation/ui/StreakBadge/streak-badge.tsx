"use client";

import { FC } from "react";
import Link from "next/link";
import { useStatisticsStudyStreak } from "@/entities/statistics";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";

// Current streak in a circle; the tooltip says what the number is
export const StreakBadge: FC<{ className?: string }> = ({ className }) => {
  const { t } = useTranslation();
  const { statisticsStudyStreakData } = useStatisticsStudyStreak();

  const days = statisticsStudyStreakData?.currentStreakDays ?? 0;
  const studiedToday = statisticsStudyStreakData?.studiedToday ?? false;
  const label =
    days > 0 ? t("nav.streak", { count: days }) : t("nav.streakNone");

  return (
    <Link
      href="/statistics"
      aria-label={label}
      title={label}
      className={cn(
        "group relative flex size-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold tabular-nums transition-colors",
        days === 0
          ? "border-neutral-300 bg-white text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400"
          : studiedToday
            ? "border-orange-500 bg-orange-500 text-white"
            : "border-orange-400 bg-white text-orange-600 dark:bg-neutral-900 dark:text-orange-400",
        className,
      )}
    >
      {statisticsStudyStreakData ? days : "·"}
      {/* The badge sits at the left edge, so a centred tooltip would go off screen */}
      <span
        role="tooltip"
        className="pointer-events-none absolute top-full left-0 z-50 mt-2 w-max max-w-56 rounded-xl bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 dark:bg-neutral-100 dark:text-neutral-900"
      >
        {label}
      </span>
    </Link>
  );
};
