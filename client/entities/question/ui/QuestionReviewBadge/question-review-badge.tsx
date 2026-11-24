"use client";

import { FC } from "react";
import { LuFlame, LuRepeat } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";
import { cn, formatTimeUntil } from "@/shared/lib";
import { useNow } from "@/shared/hooks";
import { IQuestionProgress } from "../../model/question-progress.type";


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
          : t("questions.review.next", { when: formatTimeUntil(due, i18n.language, now) })}
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
