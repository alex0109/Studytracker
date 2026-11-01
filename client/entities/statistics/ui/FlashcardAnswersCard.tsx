"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Layers } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useStatisticsFlashcardAnswers } from "../hooks";
import { IFlashcardAnswersDay } from "../model/flashcard-answers";
import { AnimatedNumber, Card, CardEmpty, CardSkeleton, TooltipShell } from "./primitives";
import { formatShortDate, useChartColors } from "./tokens";
import { useChartAnimation } from "../lib/motion";

const DAYS = 30;

// The buttons of a card in their order on the card, labels under "flashcards.answers"
const ANSWERS = [
  { key: "know", hex: "#10b981", dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
  { key: "unsure", hex: "#f59e0b", dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
  { key: "dontKnow", hex: "#f43f5e", dot: "bg-rose-500", text: "text-rose-600 dark:text-rose-400" },
] as const;

type Row = IFlashcardAnswersDay & { label: string };

function DayTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: Row }[];
}) {
  const { t } = useTranslation();
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;

  return (
    <TooltipShell>
      <p className="mb-1 text-neutral-500">{row.label}</p>
      {ANSWERS.map((answer) => (
        <p key={answer.key} className="flex items-center gap-1.5">
          <span aria-hidden className={`size-2 rounded-full ${answer.dot}`} />
          {t(`flashcards.answers.${answer.key}`)}:
          <span className="font-medium text-neutral-900 tabular-nums dark:text-neutral-50">{row[answer.key]}</span>
        </p>
      ))}
    </TooltipShell>
  );
}

// How the user flips cards: the three answers in total and day by day, and the words missed most
export function FlashcardAnswersCard() {
  const { t, i18n } = useTranslation();
  const { statisticsFlashcardAnswersData: data, statisticsFlashcardAnswersIsPending } =
    useStatisticsFlashcardAnswers(DAYS);
  const colors = useChartColors();
  const animated = useChartAnimation();

  if (statisticsFlashcardAnswersIsPending) return <CardSkeleton className="h-96 md:col-span-2" />;

  const total = data ? data.know + data.unsure + data.dontKnow : 0;

  if (!data || total === 0) {
    return (
      <CardEmpty
        className="h-52 md:col-span-2"
        icon={<Layers className="h-8 w-8" aria-hidden />}
        text={t("statistics.flashcards.empty")}
      />
    );
  }

  const share = (value: number) => Math.round((value / total) * 100);
  // Days come as local dates; read at local midnight they keep their day in every time zone
  const rows: Row[] = data.days.map((day) => ({
    ...day,
    label: formatShortDate(new Date(`${day.date}T00:00:00`), i18n.language),
  }));

  return (
    <Card
      className="md:col-span-2"
      title={t("statistics.flashcards.title")}
      subtitle={t("statistics.flashcards.subtitle", { days: DAYS })}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {ANSWERS.map((answer) => (
              <div key={answer.key} className="flex flex-col gap-1 rounded-2xl bg-neutral-50 p-3 dark:bg-neutral-800/50">
                {/* Numbers first: a label that takes two lines on a phone doesn't push its number out of line */}
                <p className="flex flex-col">
                  <span className="text-2xl font-semibold text-neutral-900 tabular-nums dark:text-neutral-50">
                    <AnimatedNumber value={data[answer.key]} />
                  </span>
                  <span className={`text-xs font-medium tabular-nums ${answer.text}`}>{share(data[answer.key])}%</span>
                </p>
                <p className="flex items-baseline gap-1.5 text-xs leading-tight text-neutral-500 dark:text-neutral-400">
                  <span aria-hidden className={`size-2 shrink-0 translate-y-px rounded-full ${answer.dot}`} />
                  <span>{t(`flashcards.answers.${answer.key}`)}</span>
                </p>
              </div>
            ))}
          </div>

          <div aria-hidden className="flex h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
            {ANSWERS.map((answer) => (
              <div
                key={answer.key}
                className="h-full transition-[width] duration-700"
                style={{ width: `${(data[answer.key] / total) * 100}%`, backgroundColor: answer.hex }}
              />
            ))}
          </div>

          <div role="img" aria-label={t("statistics.flashcards.chartLabel")} className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rows} margin={{ top: 4, right: 4, bottom: 0, left: -8 }} barCategoryGap="20%">
                <CartesianGrid vertical={false} stroke={colors.grid} />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: colors.tick, fontSize: 11 }}
                  minTickGap={24}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: colors.tick, fontSize: 11 }}
                  width={32}
                />
                <Tooltip content={<DayTooltip />} cursor={{ fill: colors.cursor }} />
                {ANSWERS.map((answer) => (
                  <Bar
                    key={answer.key}
                    dataKey={answer.key}
                    stackId="answers"
                    fill={answer.hex}
                    isAnimationActive={animated}
                    animationDuration={800}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <div>
            <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
              {t("statistics.flashcards.hardest")}
            </h4>
            <p className="text-xs text-neutral-500">{t("statistics.flashcards.hardestHint")}</p>
          </div>

          {data.hardestWords.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-neutral-200 p-4 text-center text-sm text-neutral-500 dark:border-neutral-800">
              {t("statistics.flashcards.noHard")}
            </p>
          ) : (
            <ol className="flex flex-col gap-2">
              {data.hardestWords.map((word) => (
                <li
                  key={word.entryId}
                  className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 px-3 py-2 dark:border-neutral-800"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-neutral-900 dark:text-neutral-50">
                      {word.term}
                    </span>
                    <span className="block truncate text-xs text-neutral-500">{word.translation}</span>
                  </span>
                  <span
                    title={t("statistics.flashcards.missedOf", { count: word.dontKnow, answers: word.answers })}
                    className="shrink-0 rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-medium text-rose-700 tabular-nums dark:text-rose-400"
                  >
                    {word.dontKnow}/{word.answers}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </Card>
  );
}
