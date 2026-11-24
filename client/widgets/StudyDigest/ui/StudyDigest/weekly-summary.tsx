"use client";

import { FC } from "react";
import { LuTrendingDown, LuTrendingUp } from "react-icons/lu";
import { IWeeklyDigestData } from "@/entities/notification";
import { useTranslation } from "@/shared/i18n";
import { cn, formatIsoDate } from "@/shared/lib";

const SHORT_DAY = { day: "numeric", month: "short" } as const;

// Last week in numbers: study days, accuracy against the week before, the weakest subjects
export const WeeklySummary: FC<{ data: IWeeklyDigestData; language: string }> = ({ data, language }) => {
  const { t } = useTranslation();
  const delta =
    data.accuracy !== null && data.previousAccuracy !== null
      ? Math.round(data.accuracy - data.previousAccuracy)
      : null;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-neutral-500">
        {formatIsoDate(data.from, language, SHORT_DAY)} – {formatIsoDate(data.to, language, SHORT_DAY)}
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
