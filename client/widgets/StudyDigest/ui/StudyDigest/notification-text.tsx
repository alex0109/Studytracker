"use client";

import { FC } from "react";
import { INotification, NotificationTypeEnum } from "@/entities/notification";
import { useTranslation } from "@/shared/i18n";
import { formatIsoDate } from "@/shared/lib";

const SHORT_DAY = { day: "numeric", month: "short" } as const;

// What a reminder in the inbox says, by its kind
export const NotificationText: FC<{ item: INotification }> = ({ item }) => {
  const { t, i18n } = useTranslation();

  switch (item.type) {
    case NotificationTypeEnum.DailyReview:
      return item.data.dueWords > 0 || !item.data.dueQuestions
        ? t("digest.inbox.daily", { count: item.data.dueWords })
        : t("digest.inbox.dailyQuestions", { count: item.data.dueQuestions });
    case NotificationTypeEnum.StreakAtRisk:
      return t("digest.inbox.streak", { count: item.data.streakDays });
    case NotificationTypeEnum.WeeklyDigest:
      return t("digest.inbox.weekly", {
        range: `${formatIsoDate(item.data.from, i18n.language, SHORT_DAY)} – ${formatIsoDate(item.data.to, i18n.language, SHORT_DAY)}`,
      });
  }
};
