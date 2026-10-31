"use client";

import { FC } from "react";
import { LuFlame, LuRepeat } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";
import { useNow } from "@/shared/hooks";
import { IQuestionProgress } from "../../model/question-progress.type";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

// "in 3 days" / "через 3 дні" in the interface language, without our own plural rules
const relative = (due: Date, now: number, language: string) => {
  const format = new Intl.RelativeTimeFormat(language, { numeric: "auto" });
  const diff = due.getTime() - now;

  return diff < DAY
    ? format.format(Math.max(1, Math.round(diff / HOUR)), "hour")
    : format.format(Math.round(diff / DAY), "day");
};

// Small mark under a question: when it comes back, or that it is due now, or that it keeps failing
export const QuestionReviewBadge: FC<{ progress?: IQuestionProgress | null }> = ({
  progress,
}) => {
  const { t, i18n } = useTranslation();
  const now = useNow();
  if (!progress) return null;

  const due = new Date(progress.due);
  const isDue = due.getTime() <= now;

  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
          isDue
            ? "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
            : "bg-neutral-200/70 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
        )}
      >
        <LuRepeat aria-hidden />
        {isDue
          ? t("questions.review.due")
          : t("questions.review.next", { when: relative(due, now, i18n.language) })}
      </span>
      {progress.isLeech && (
        <span
          title={t("questions.review.leechHint")}
          className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300"
        >
          <LuFlame aria-hidden />
          {t("questions.review.leech")}
        </span>
      )}
    </span>
  );
};
