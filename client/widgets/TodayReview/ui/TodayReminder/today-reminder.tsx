"use client";

import { FC } from "react";
import Link from "next/link";
import { LuArrowRight, LuBellRing } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { useReviewToday } from "@/entities/review";

// While "Today" has something to repeat it says so above the materials. It can't be closed: it goes away
// by itself once the queue is done, so it never nags about nothing
export const TodayReminder: FC<{ className?: string }> = ({ className }) => {
  const { t } = useTranslation();
  const { todayData } = useReviewToday();
  const words = todayData?.wordsInSession ?? 0;
  const questions = todayData?.questionsInSession ?? 0;

  if (words + questions === 0) return null;

  const what =
    words > 0 && questions > 0
      ? t("today.reminder.both", { words: t("today.words", { count: words }), questions: t("today.questions", { count: questions }) })
      : words > 0
        ? t("today.words", { count: words })
        : t("today.questions", { count: questions });

  return (
    <section
      role="status"
      className={cn(
        "relative flex w-full flex-col gap-3 overflow-hidden rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 p-4 text-white shadow-lg shadow-emerald-600/20 sm:flex-row sm:items-center sm:justify-between sm:p-5 dark:from-emerald-700 dark:to-teal-700 dark:shadow-none",
        "animate-in fade-in slide-in-from-top-2 duration-500 motion-reduce:animate-none",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <span className="relative flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-xl">
          <LuBellRing aria-hidden className="motion-safe:animate-[wiggle_2.4s_ease-in-out_infinite]" />
          <span aria-hidden className="absolute -right-1 -top-1 flex size-3">
            <span className="absolute inline-flex size-full rounded-full bg-amber-300 opacity-75 motion-safe:animate-ping" />
            <span className="relative inline-flex size-3 rounded-full bg-amber-300" />
          </span>
        </span>
        <div className="flex flex-col gap-0.5">
          <p className="font-semibold">{t("today.reminder.title")}</p>
          <p className="text-sm text-white/85">{t("today.reminder.text", { what, minutes: todayData?.estimatedMinutes ?? 1 })}</p>
        </div>
      </div>
      <Link
        href="/app"
        className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-50 max-sm:h-12 max-sm:text-base"
      >
        {t("today.reminder.button")} <LuArrowRight aria-hidden />
      </Link>
    </section>
  );
};
