"use client";

import { FC } from "react";
import Link from "next/link";
import { LuCalendarClock, LuChevronRight, LuClock } from "react-icons/lu";
import { useDeadlines } from "@/entities/deadline";
import { Skeleton } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { formatIsoDate } from "@/shared/lib/dates";
import { cn } from "@/shared/lib";
import { daysLeftTone, useDeadlineText } from "../lib/deadline-text";

// Everything with a date, the least time left on top
export const DeadlinesSection: FC = () => {
  const { t, i18n } = useTranslation();
  const { deadlinesData, deadlinesIsPending } = useDeadlines();
  const text = useDeadlineText();

  return (
    <section aria-labelledby="deadlines-title" className="flex w-full max-w-5xl flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <h2 id="deadlines-title" className="flex items-center gap-2 text-xl! font-semibold!">
          <LuCalendarClock aria-hidden className="size-5" />
          {t("deadline.sectionTitle")}
        </h2>
        <p className="text-sm text-neutral-500">{t("deadline.sectionSubtitle")}</p>
      </div>

      {deadlinesIsPending ? (
        <div aria-busy="true" className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      ) : !deadlinesData?.length ? (
        <p className="rounded-2xl border border-dashed border-neutral-300 p-5 text-center text-sm text-neutral-500 dark:border-neutral-700">
          {t("deadline.sectionEmpty")}
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          {deadlinesData.map((plan) => {
            const review = plan.dueWords + plan.dueQuestions;
            const learn = plan.newWordsToday + plan.newQuestionsToday;

            return (
              <li key={plan.materialId}>
                <Link
                  href={`/materials?material=${plan.materialId}`}
                  className="group flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3 transition hover:border-neutral-300 hover:shadow-sm sm:p-4 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
                >
                  <span
                    className={cn(
                      "flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl tabular-nums",
                      daysLeftTone(plan.daysLeft).badge,
                    )}
                  >
                    <span className="text-lg leading-none font-bold">{Math.abs(plan.daysLeft)}</span>
                    <span className="mt-0.5 text-[0.65rem] leading-none">{t("deadline.daysShort")}</span>
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate font-medium text-neutral-900 dark:text-neutral-50">{plan.title}</span>
                    <span className="text-sm text-neutral-500">
                      {text.daysLeft(plan.daysLeft)} ·{" "}
                      {formatIsoDate(plan.deadline, i18n.language, { day: "numeric", month: "long" })}
                    </span>
                    {plan.pace !== "Passed" && (
                      <span className="flex flex-wrap items-center gap-x-2 text-xs text-neutral-500">
                        {plan.pace === "Ready"
                          ? t("deadline.readyShort")
                          : plan.pace === "Empty"
                            ? t("deadline.emptyShort")
                            : t("deadline.todayShort", { review, learn })}
                        {plan.minutesToday > 0 && (
                          <span className="inline-flex items-center gap-1">
                            <LuClock aria-hidden className="size-3" />
                            {t("deadline.minutesToday", { count: plan.minutesToday })}
                          </span>
                        )}
                      </span>
                    )}
                  </span>
                  <LuChevronRight
                    aria-hidden
                    className="size-4 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
