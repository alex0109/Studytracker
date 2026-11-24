"use client";

import { FC } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LuArrowRight, LuBookA, LuChartColumn, LuFlame } from "react-icons/lu";
import {
  INotification,
  NotificationTypeEnum,
  useNotificationFeed,
} from "@/entities/notification";
import { ReminderSettingsCard } from "@/features/reminders";
import { Skeleton } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { DigestCard } from "./digest-card";
import { WeeklySummary } from "./weekly-summary";
import { NotificationsInbox } from "./notifications-inbox";

// "Your day": what to review now, how the streak is doing, last week's digest and the reminders inbox
export const StudyDigest: FC = () => {
  const { t, i18n } = useTranslation();
  const { feedData, feedIsPending } = useNotificationFeed();

  const heading = (
    <div>
      <h2 className="text-2xl! font-semibold! text-neutral-900 dark:text-neutral-50">{t("digest.title")}</h2>
      <p className="text-sm text-neutral-500">{t("digest.subtitle")}</p>
    </div>
  );

  // The title is there at once and the cards keep their shape while the numbers load,
  // so the block is seen loading instead of the page jumping when it arrives
  if (feedIsPending || !feedData) {
    return (
      <div aria-busy="true" aria-label={t("common.loading")} className="flex w-full max-w-5xl flex-col gap-4">
        {heading}
        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((card) => (
            <div
              key={card}
              className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none"
            >
              <div className="flex items-center gap-2">
                <Skeleton className="size-8 rounded-xl" />
                <Skeleton className="h-3.5 w-24 rounded-full" />
              </div>
              <Skeleton className="h-10 w-16 rounded-xl" />
              <Skeleton className="h-3.5 w-full rounded-full" />
              <Skeleton className="h-3.5 w-2/3 rounded-full" />
            </div>
          ))}
        </div>
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
      <div className="flex items-end justify-between gap-3">{heading}</div>

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
            {(today.dueQuestions ?? 0) > 0 && ` ${t("digest.today.plusQuestions", { count: today.dueQuestions })}`}
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
          {(today.dueWords > 0 || today.newWords > 0 || (today.dueQuestions ?? 0) > 0) && (
            <Link
              href="/app"
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
        <NotificationsInbox notifications={notifications} unreadCount={unreadCount} />

        <ReminderSettingsCard />
      </div>
    </motion.div>
  );
};
