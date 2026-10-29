"use client";

import { FC } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LuArrowRight,
  LuBookA,
  LuCalendarCheck,
  LuChartColumn,
  LuFlame,
  LuInbox,
  LuTrendingDown,
  LuTrendingUp,
} from "react-icons/lu";
import {
  INotification,
  IWeeklyDigestData,
  NotificationTypeEnum,
  useNotificationFeed,
} from "@/entities/notification";
import { ReminderSettingsCard, useNotificationsRead } from "@/features/reminders";
import { Skeleton } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { DigestCard } from "./digest-card";

const formatDay = (value: string, language: string) =>
  new Intl.DateTimeFormat(language, { day: "numeric", month: "short" }).format(new Date(`${value}T12:00:00`));

// "Your day": what to review now, how the streak is doing, last week's digest and the reminders inbox
export const StudyDigest: FC = () => {
  const { t, i18n } = useTranslation();
  const { feedData, feedIsPending } = useNotificationFeed();
  const { markRead, markAllRead, markAllReadIsPending } = useNotificationsRead();

  if (feedIsPending || !feedData) {
    return (
      <div className="grid w-full gap-4 md:grid-cols-3">
        <Skeleton className="h-44 rounded-2xl" />
        <Skeleton className="h-44 rounded-2xl" />
        <Skeleton className="h-44 rounded-2xl" />
      </div>
    );
  }

  const { today, notifications, unreadCount } = feedData;
  const weekly = notifications.find(
    (item): item is Extract<INotification, { type: NotificationTypeEnum.WeeklyDigest }> =>
      item.type === NotificationTypeEnum.WeeklyDigest,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full max-w-5xl flex-col gap-4"
    >
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl! font-semibold! text-neutral-900 dark:text-neutral-50">
            {t("digest.title")}
          </h2>
          <p className="text-sm text-neutral-500">{t("digest.subtitle")}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <DigestCard icon={<LuBookA aria-hidden />} title={t("digest.today.title")} accent="emerald">
          <p className="text-4xl font-bold tabular-nums text-neutral-900 dark:text-neutral-50">
            {today.dueWords}
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            {today.dueWords > 0
              ? t("digest.today.due", { count: today.dueWords })
              : today.newWords > 0
                ? t("digest.today.onlyNew", { count: today.newWords })
                : t("digest.today.clear")}
            {today.dueWords > 0 && today.newWords > 0 && ` ${t("digest.today.plusNew", { count: today.newWords })}`}
          </p>
          {today.dictionaries.length > 0 && (
            <ul className="flex flex-col gap-1.5">
              {today.dictionaries.slice(0, 3).map((dictionary) => (
                <li key={dictionary.dictionaryId} className="flex items-center justify-between gap-2 text-sm">
                  <span className="truncate text-neutral-700 dark:text-neutral-300">{dictionary.title}</span>
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {dictionary.due > 0 ? t("digest.today.dueShort", { count: dictionary.due }) : t("digest.today.newShort", { count: dictionary.new })}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {(today.dueWords > 0 || today.newWords > 0) && (
            <Link
              href="/materials"
              className="mt-auto inline-flex items-center gap-1 self-start text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
            >
              {t("digest.today.cta")} <LuArrowRight aria-hidden />
            </Link>
          )}
        </DigestCard>

        <DigestCard
          icon={<LuFlame aria-hidden />}
          title={t("digest.streak.title")}
          accent="orange"
          className={cn(today.streakAtRisk && "border-orange-300 dark:border-orange-800")}
        >
          <p className="text-4xl font-bold tabular-nums text-neutral-900 dark:text-neutral-50">
            {today.streakDays}
            <span className="ml-2 text-base font-medium text-neutral-500">
              {t("statistics.streak.inARow", { count: today.streakDays })}
            </span>
          </p>
          <p
            className={cn(
              "text-sm",
              today.streakAtRisk
                ? "font-medium text-orange-600 dark:text-orange-400"
                : "text-neutral-600 dark:text-neutral-300",
            )}
          >
            {today.studiedToday
              ? t("digest.streak.safe")
              : today.streakAtRisk
                ? t("digest.streak.atRisk", { count: today.streakDays })
                : today.streakDays > 0
                  ? t("digest.streak.keep")
                  : t("digest.streak.start")}
          </p>
        </DigestCard>

        <DigestCard icon={<LuChartColumn aria-hidden />} title={t("digest.weekly.title")} accent="violet">
          {weekly ? (
            <WeeklySummary data={weekly.data} language={i18n.language} />
          ) : (
            <p className="text-sm text-neutral-600 dark:text-neutral-300">{t("digest.weekly.none")}</p>
          )}
        </DigestCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DigestCard icon={<LuInbox aria-hidden />} title={t("digest.inbox.title")}>
          {notifications.length === 0 ? (
            <p className="text-sm text-neutral-500">{t("digest.inbox.empty")}</p>
          ) : (
            <>
              <ul className="flex flex-col gap-1">
                {notifications.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => !item.readAt && markRead(item.id)}
                      className="flex w-full items-start gap-3 rounded-xl px-2 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "mt-1.5 size-2 shrink-0 rounded-full",
                          item.readAt ? "bg-transparent" : "bg-violet-500",
                        )}
                      />
                      <span className="flex min-w-0 flex-col">
                        <span className={cn("text-sm", item.readAt ? "text-neutral-600 dark:text-neutral-400" : "font-medium text-neutral-900 dark:text-neutral-100")}>
                          <NotificationText item={item} />
                        </span>
                        <span className="text-xs text-neutral-400">
                          {new Date(item.createdAt).toLocaleString(i18n.language, {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              {unreadCount > 0 && (
                <button
                  type="button"
                  disabled={markAllReadIsPending}
                  onClick={() => markAllRead()}
                  className="self-start text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                >
                  <LuCalendarCheck className="mr-1 inline" aria-hidden />
                  {t("digest.inbox.markAll", { count: unreadCount })}
                </button>
              )}
            </>
          )}
        </DigestCard>

        <ReminderSettingsCard />
      </div>
    </motion.div>
  );
};

const WeeklySummary: FC<{ data: IWeeklyDigestData; language: string }> = ({ data, language }) => {
  const { t } = useTranslation();
  const delta =
    data.accuracy !== null && data.previousAccuracy !== null
      ? Math.round(data.accuracy - data.previousAccuracy)
      : null;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-neutral-500">
        {formatDay(data.from, language)} – {formatDay(data.to, language)}
      </p>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <span className="text-neutral-500">{t("digest.weekly.studyDays")}</span>
        <span className="text-right font-semibold text-neutral-900 dark:text-neutral-100">
          {data.studyDays}/7
        </span>
        {data.accuracy !== null && (
          <>
            <span className="text-neutral-500">{t("digest.weekly.accuracy")}</span>
            <span className="flex items-center justify-end gap-1 font-semibold text-neutral-900 dark:text-neutral-100">
              {Math.round(data.accuracy)}%
              {delta !== null && delta !== 0 && (
                <span className={cn("flex items-center text-xs", delta > 0 ? "text-emerald-600" : "text-rose-600")}>
                  {delta > 0 ? <LuTrendingUp aria-hidden /> : <LuTrendingDown aria-hidden />}
                  {delta > 0 ? `+${delta}` : delta}
                </span>
              )}
            </span>
          </>
        )}
        <span className="text-neutral-500">{t("digest.weekly.reviews")}</span>
        <span className="text-right font-semibold text-neutral-900 dark:text-neutral-100">{data.reviews}</span>
        <span className="text-neutral-500">{t("digest.weekly.attempts")}</span>
        <span className="text-right font-semibold text-neutral-900 dark:text-neutral-100">{data.attempts}</span>
      </div>
      {data.weakestTopics.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-neutral-500">{t("digest.weekly.weakest")}</span>
          <div className="flex flex-wrap gap-1.5">
            {data.weakestTopics.map((topic) => (
              <span
                key={topic.name}
                className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
              >
                #{topic.name} · {Math.round(topic.accuracy)}%
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const NotificationText: FC<{ item: INotification }> = ({ item }) => {
  const { t, i18n } = useTranslation();

  switch (item.type) {
    case NotificationTypeEnum.DailyReview:
      return t("digest.inbox.daily", { count: item.data.dueWords });
    case NotificationTypeEnum.StreakAtRisk:
      return t("digest.inbox.streak", { count: item.data.streakDays });
    case NotificationTypeEnum.WeeklyDigest:
      return t("digest.inbox.weekly", {
        range: `${formatDay(item.data.from, i18n.language)} – ${formatDay(item.data.to, i18n.language)}`,
      });
  }
};
