"use client";

import { FC } from "react";
import { useTranslation } from "@/shared/i18n";
import moment from "moment";
import { cn } from "@/shared/lib";
import { FlashcardStateEnum, IFlashcardProgress } from "../../model";

interface FlashcardProgressBadgeProps {
  progress?: IFlashcardProgress;
  className?: string;
}

const STATE_STYLES: Record<FlashcardStateEnum, string> = {
  [FlashcardStateEnum.New]: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
  [FlashcardStateEnum.Learning]: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  [FlashcardStateEnum.Review]: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  [FlashcardStateEnum.Relearning]: "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300",
};

export const FlashcardProgressBadge: FC<FlashcardProgressBadgeProps> = ({
  progress,
  className,
}) => {
  const { t } = useTranslation();
  const state = progress?.state ?? FlashcardStateEnum.New;
  const isNew = state === FlashcardStateEnum.New;
  const isDue = !!progress && new Date(progress.due).getTime() <= Date.now();

  return (
    <span
      title={
        progress
          ? t("flashcards.badge.nextReview", { date: moment(progress.due).format("DD MMM YYYY, HH:mm") })
          : t("flashcards.badge.notReviewed")
      }
      className={cn(
        "inline-flex items-center rounded-xl px-2 py-0.5 text-xs font-medium",
        STATE_STYLES[state],
        className,
      )}
    >
      {t(`flashcards.state.${state}`)}
      {!isNew &&
        progress &&
        (isDue ? ` · ${t("flashcards.badge.dueNow")}` : ` · ${moment(progress.due).fromNow()}`)}
    </span>
  );
};
