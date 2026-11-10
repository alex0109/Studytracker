"use client";

import { FC } from "react";
import { LuCalendarPlus, LuChevronDown } from "react-icons/lu";
import { useDeadlinePlan } from "@/entities/deadline";
import { useMaterialDeadline } from "@/features/material/set-deadline";
import { Skeleton } from "@/shared/radix-ui";
import { DatePicker, Spinner } from "@/shared/ui";
import { useTranslation } from "@/shared/i18n";
import { addDaysIso, formatIsoDate, todayIso } from "@/shared/lib/dates";
import { cn } from "@/shared/lib";
import { daysLeftTone, useDeadlineText } from "../lib/deadline-text";

const MAX_YEARS_AHEAD = 5;

// The deadline as one chip in a material's properties: a date to pick, or the date and days left
export const DeadlineProperty: FC<{ materialId: string }> = ({ materialId }) => {
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

  if (deadlinePlanIsPending) return <Skeleton className="h-7 w-32 rounded-full" />;

  if (!plan) {
    return (
      <DatePicker value={null} {...picker}>
        <button
          type="button"
          disabled={setDeadlineIsPending}
          className="inline-flex h-7 items-center gap-1 rounded-full border border-dashed border-neutral-300 px-2.5 text-xs font-medium text-neutral-500 transition hover:border-neutral-500 hover:text-neutral-800 dark:border-neutral-700 dark:hover:border-neutral-500 dark:hover:text-neutral-200"
        >
          {setDeadlineIsPending ? <Spinner /> : <LuCalendarPlus aria-hidden />}
          {t("deadline.add")}
        </button>
      </DatePicker>
    );
  }

  return (
    <DatePicker value={plan.deadline} onClear={() => setDeadline(null)} {...picker}>
      <button
        type="button"
        disabled={setDeadlineIsPending}
        aria-label={`${t("deadline.title")}: ${text.daysLeft(plan.daysLeft)}. ${t("deadline.change")}`}
        className={cn(
          "inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium transition hover:brightness-95",
          daysLeftTone(plan.daysLeft).badge,
        )}
      >
        {setDeadlineIsPending && <Spinner />}
        {formatIsoDate(plan.deadline, i18n.language, { day: "numeric", month: "short" })}
        <span aria-hidden className="opacity-60">·</span>
        <span>{text.daysLeft(plan.daysLeft)}</span>
        <LuChevronDown aria-hidden className="size-3 opacity-60" />
      </button>
    </DatePicker>
  );
};
