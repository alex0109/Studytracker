"use client";

import { useTranslation } from "@/shared/i18n";

// Red when it is close, amber within a week: the same colours on the card and in the list
export const daysLeftTone = (daysLeft: number) => {
  if (daysLeft < 0) {
    return {
      badge: "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400",
    };
  }
  if (daysLeft <= 3) {
    return { badge: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300" };
  }
  if (daysLeft <= 7) {
    return { badge: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" };
  }
  return { badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" };
};

export const useDeadlineText = () => {
  const { t, i18n } = useTranslation();

  return {
    daysLeft: (days: number) =>
      days < 0
        ? t("deadline.daysAgo", { count: -days })
        : days === 0
          ? t("deadline.isToday")
          : days === 1
            ? t("deadline.isTomorrow")
            : t("deadline.daysLeft", { count: days }),

    // "8 words and 3 questions", without what is zero; "" when both are
    items: (words: number, questions: number) =>
      new Intl.ListFormat(i18n.language, { type: "conjunction" }).format(
        [
          words > 0 ? t("deadline.words", { count: words }) : null,
          questions > 0 ? t("deadline.questions", { count: questions }) : null,
        ].filter((item): item is string => item !== null),
      ),
  };
};
