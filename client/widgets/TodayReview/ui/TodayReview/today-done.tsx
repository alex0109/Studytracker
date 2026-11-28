"use client";

import { FC } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LuArrowRight,
  LuBookA,
  LuChartSpline,
  LuCircleCheckBig,
  LuListChecks,
  LuMinus,
  LuTarget,
  LuTrendingDown,
  LuTrendingUp,
} from "react-icons/lu";
import { IconType } from "react-icons";
import { Button, Skeleton } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { IReviewAnswerResult, IReviewDay, useReviewDaySummary } from "@/entities/review";
import { FlashcardAnswerEnum } from "@/features/dictionary/practice-dictionary";

export type WordCounts = Record<FlashcardAnswerEnum, number>;

interface TodayDoneProps {
  // What this run had: the words by answer and the questions with their results
  words?: WordCounts;
  questions?: IReviewAnswerResult[];
  onBack: () => void;
}

// A difference this small is the same day, not a trend
const SAME_WITHIN = 3;

const Tile: FC<{ icon: IconType; label: string; value: string; hint?: string; tone: string }> = ({
  icon: Icon,
  label,
  value,
  hint,
  tone,
}) => (
  <div className={cn("flex flex-col gap-1 rounded-xl p-4 text-left", tone)}>
    <span className="flex items-center gap-1.5 text-sm">
      <Icon aria-hidden /> {label}
    </span>
    <span className="text-2xl font-bold tabular-nums text-neutral-900 dark:text-neutral-50">{value}</span>
    {hint && <span className="text-xs text-neutral-500 dark:text-neutral-400">{hint}</span>}
  </div>
);

// Today against the last day before it with reviews: better, worse or the same, and by how much
const Comparison: FC<{ today: IReviewDay; previous?: IReviewDay | null }> = ({ today, previous }) => {
  const { t, i18n } = useTranslation();

  if (!previous) {
    return <p className="text-sm text-neutral-500 dark:text-neutral-400">{t("today.done.firstDay")}</p>;
  }

  const date = new Date(`${previous.date}T12:00:00`).toLocaleDateString(i18n.language, { day: "numeric", month: "long" });
  const difference = today.accuracy - previous.accuracy;
  const trend = Math.abs(difference) < SAME_WITHIN ? "same" : difference > 0 ? "better" : "worse";
  const Icon = trend === "better" ? LuTrendingUp : trend === "worse" ? LuTrendingDown : LuMinus;

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl p-4 text-left",
        trend === "better" && "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100",
        trend === "worse" && "bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100",
        trend === "same" && "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100",
      )}
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl text-xl",
          trend === "better" && "bg-emerald-600 text-white",
          trend === "worse" && "bg-amber-500 text-white",
          trend === "same" && "bg-neutral-300 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200",
        )}
      >
        <Icon aria-hidden />
      </span>
      <div className="flex flex-col gap-0.5">
        <p className="font-semibold">{t(`today.done.compare.${trend}`, { date })}</p>
        <p className="text-sm opacity-80">
          {t("today.done.compare.numbers", { today: today.accuracy, previous: previous.accuracy })}
        </p>
      </div>
    </div>
  );
};

export const TodayDone: FC<TodayDoneProps> = ({ words, questions, onBack }) => {
  const { t } = useTranslation();
  const { summaryData, summaryIsPending } = useReviewDaySummary(true);

  const wordsTotal = words ? Object.values(words).reduce((sum, value) => sum + value, 0) : 0;
  const wordsKnown = words?.[FlashcardAnswerEnum.Know] ?? 0;
  const questionsTotal = questions?.length ?? 0;
  const questionsRight = questions?.filter((result) => result.isCorrect).length ?? 0;
  // Words, questions and the day's accuracy; a run may have had only one of the first two
  const tiles = (wordsTotal > 0 ? 1 : 0) + (questionsTotal > 0 ? 1 : 0) + 1;

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-4 rounded-2xl bg-white p-6 text-center sm:p-8 dark:bg-neutral-900">
      <motion.span
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 12 }}
        className="text-5xl text-emerald-500"
      >
        <LuCircleCheckBig aria-hidden />
      </motion.span>
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold">{t("today.done.title")}</h2>
        <p className="max-w-md text-sm text-neutral-500">{t("today.done.text")}</p>
      </div>

      {/* How this run went */}
      <div
        className={cn(
          "grid w-full gap-3",
          tiles === 3 ? "grid-cols-2 sm:grid-cols-3" : tiles === 2 ? "grid-cols-2" : "grid-cols-1",
        )}
      >
        {wordsTotal > 0 && (
          <Tile
            icon={LuBookA}
            label={t("today.startWords")}
            value={t("today.done.ofTotal", { done: wordsKnown, total: wordsTotal })}
            hint={t("today.done.wordsKnown")}
            tone="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
          />
        )}
        {questionsTotal > 0 && (
          <Tile
            icon={LuListChecks}
            label={t("today.startQuestions")}
            value={t("today.done.ofTotal", { done: questionsRight, total: questionsTotal })}
            hint={t("today.done.questionsRight")}
            tone="bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300"
          />
        )}
        {summaryIsPending ? (
          <Skeleton className={cn("h-[6.5rem] rounded-xl", tiles === 3 && "col-span-2 sm:col-span-1")} />
        ) : (
          summaryData && (
            <Tile
              icon={LuTarget}
              label={t("today.done.accuracy")}
              value={`${summaryData.today.accuracy}%`}
              hint={t("today.done.reviewsToday", { count: summaryData.today.reviews })}
              tone={cn(
                "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
                tiles === 3 && "col-span-2 sm:col-span-1",
              )}
            />
          )
        )}
      </div>

      {/* Compared with the day before that had reviews */}
      <div className="w-full">
        {summaryIsPending ? (
          <Skeleton className="h-[4.5rem] w-full rounded-xl" />
        ) : (
          summaryData && <Comparison today={summaryData.today} previous={summaryData.previous} />
        )}
      </div>

      <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
        <Button asChild size="lg" className="bg-violet-600 text-white hover:bg-violet-700 dark:bg-violet-600 dark:text-white dark:hover:bg-violet-500">
          <Link href="/statistics">
            <LuChartSpline aria-hidden /> {t("today.done.statsButton")} <LuArrowRight aria-hidden />
          </Link>
        </Button>
        <Button size="lg" variant="ghost" onClick={onBack}>
          {t("today.done.back")}
        </Button>
      </div>
    </div>
  );
};
