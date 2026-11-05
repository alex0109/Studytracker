"use client";

import { FC } from "react";
import type { TFunction } from "i18next";
import Link from "next/link";
import {
  LuArrowRight,
  LuBrain,
  LuCalendarClock,
  LuCalendarPlus,
  LuCircleCheck,
  LuClock,
  LuPencil,
  LuRepeat,
  LuShieldQuestion,
  LuSparkles,
  LuTriangleAlert,
} from "react-icons/lu";
import { IDeadlinePlan, useDeadlinePlan } from "@/entities/deadline";
import { useMaterialDeadline } from "@/features/material/set-deadline";
import { Button, Skeleton } from "@/shared/radix-ui";
import { DatePicker, Spinner } from "@/shared/ui";
import { useTranslation } from "@/shared/i18n";
import { addDaysIso, formatIsoDate, todayIso } from "@/shared/lib/dates";
import { cn } from "@/shared/lib";
import { daysLeftTone, useDeadlineText } from "../lib/deadline-text";

const MAX_YEARS_AHEAD = 5;

// What today asks for, most urgent first; a line that would be empty is left out
const planSteps = (current: IDeadlinePlan, words: ReturnType<typeof useDeadlineText>, t: TFunction) => {
  if (current.pace === "Passed") {
    return [{ key: "passed", icon: LuCalendarClock, text: t("deadline.passed"), iconClass: undefined }];
  }
  if (current.pace === "Empty") {
    return [{ key: "empty", icon: LuSparkles, text: t("deadline.empty"), iconClass: undefined }];
  }
  if (current.pace === "Ready") {
    return [{ key: "ready", icon: LuCircleCheck, text: t("deadline.ready"), iconClass: "text-emerald-500" }];
  }

  const review = words.items(current.dueWords, current.dueQuestions);
  const learn = words.items(current.newWordsToday, current.newQuestionsToday);
  const weak = words.items(current.weakWords, current.weakQuestions);
  const left = words.items(current.newWords, current.newQuestions);

  return [
    current.pace === "Tight" && {
      key: "tight",
      icon: LuTriangleAlert,
      text: t("deadline.tight"),
      iconClass: "text-amber-500",
    },
    review && { key: "review", icon: LuRepeat, text: t("deadline.reviewToday", { items: review }), iconClass: undefined },
    learn && {
      key: "learn",
      icon: LuSparkles,
      text: t("deadline.learnToday", { items: learn, left }),
      iconClass: undefined,
    },
    weak && { key: "weak", icon: LuBrain, text: t("deadline.weak", { items: weak }), iconClass: undefined },
    current.attemptRecommended && {
      key: "attempt",
      icon: LuShieldQuestion,
      text: t("deadline.attempt"),
      iconClass: undefined,
    },
    current.reviewsPerDay > 0 && {
      key: "perDay",
      icon: LuClock,
      text: t("deadline.perDay", { count: current.reviewsPerDay }),
      iconClass: undefined,
    },
  ].filter((step) => !!step);
};

// The date and what it asks for today, on the material's page. Without a date only a quiet
// button: a deadline is optional and most materials don't need one
export const DeadlinePlanCard: FC<{ materialId: string }> = ({ materialId }) => {
  const { t, i18n } = useTranslation();
  const { deadlinePlanData: plan, deadlinePlanIsPending } = useDeadlinePlan(materialId);
  const { setDeadline, setDeadlineIsPending } = useMaterialDeadline(materialId);
  const text = useDeadlineText();

  const today = todayIso();
  const picker = {
    min: today,
    max: addDaysIso(today, 365 * MAX_YEARS_AHEAD),
    onChange: (iso: string) => setDeadline(iso),
  };

  if (deadlinePlanIsPending) return <Skeleton className="h-10 w-full rounded-2xl" />;

  if (!plan) {
    return (
      <DatePicker value={null} {...picker}>
        <Button variant="outline" className="self-start border-dashed" disabled={setDeadlineIsPending}>
          {setDeadlineIsPending ? <Spinner /> : <LuCalendarPlus aria-hidden />}
          {t("deadline.add")}
        </Button>
      </DatePicker>
    );
  }

  const steps = planSteps(plan, text, t);
  const tone = daysLeftTone(plan.daysLeft);

  return (
    <section
      aria-label={t("deadline.title")}
      className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <header className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", tone.badge)}>
          <LuCalendarClock aria-hidden className="size-5" />
        </span>
        <div className="flex min-w-0 flex-col">
          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-50">{text.daysLeft(plan.daysLeft)}</h3>
          <p className="text-sm text-neutral-500 first-letter:uppercase">
            {formatIsoDate(plan.deadline, i18n.language, { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        {plan.minutesToday > 0 && (
          <span className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
            <LuClock aria-hidden className="size-3.5" />
            {t("deadline.minutesToday", { count: plan.minutesToday })}
          </span>
        )}
        <DatePicker value={plan.deadline} onClear={() => setDeadline(null)} align="end" {...picker}>
          <Button variant="ghost" size="sm" className="ml-auto" disabled={setDeadlineIsPending}>
            {setDeadlineIsPending ? <Spinner /> : <LuPencil aria-hidden />}
            {t("deadline.change")}
          </Button>
        </DatePicker>
      </header>

      {steps.length > 0 && (
        <ul className="flex flex-col gap-2">
          {steps.map((step) => (
            <li key={step.key} className="flex items-start gap-2.5 text-sm text-neutral-700 dark:text-neutral-300">
              <step.icon aria-hidden className={cn("mt-0.5 size-4 shrink-0", step.iconClass ?? "text-neutral-400")} />
              <span>{step.text}</span>
            </li>
          ))}
        </ul>
      )}

      {plan.dueWords + plan.dueQuestions + plan.newWordsToday + plan.newQuestionsToday > 0 && plan.pace !== "Passed" && (
        <Link
          href="/app"
          className="inline-flex items-center gap-1 self-start text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
        >
          {t("deadline.startToday")} <LuArrowRight aria-hidden />
        </Link>
      )}
    </section>
  );
};
