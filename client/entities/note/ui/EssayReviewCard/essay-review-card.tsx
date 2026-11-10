"use client";

import { FC, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  LuArrowRight,
  LuCircleCheck,
  LuInfo,
  LuLightbulb,
  LuSpellCheck,
} from "react-icons/lu";
import { cn } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";
import { IEssayReview } from "../../model";
import { essayScoreLevel, EssayScoreLevel } from "../../lib";

// Colours of the scale bands, light and dark
const LEVEL_STYLES: Record<EssayScoreLevel, { text: string; bar: string; soft: string }> = {
  excellent: {
    text: "text-emerald-600 dark:text-emerald-400",
    bar: "bg-emerald-500",
    soft: "bg-emerald-50 dark:bg-emerald-950/40",
  },
  good: {
    text: "text-sky-600 dark:text-sky-400",
    bar: "bg-sky-500",
    soft: "bg-sky-50 dark:bg-sky-950/40",
  },
  adequate: {
    text: "text-violet-600 dark:text-violet-400",
    bar: "bg-violet-500",
    soft: "bg-violet-50 dark:bg-violet-950/40",
  },
  partial: {
    text: "text-amber-600 dark:text-amber-400",
    bar: "bg-amber-500",
    soft: "bg-amber-50 dark:bg-amber-950/40",
  },
  weak: {
    text: "text-rose-600 dark:text-rose-400",
    bar: "bg-rose-500",
    soft: "bg-rose-50 dark:bg-rose-950/40",
  },
};

// Long lists of corrections start folded
const SHOWN_CORRECTIONS = 5;

const ScoreRing: FC<{ score: number; level: EssayScoreLevel }> = ({ score, level }) => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative size-24 shrink-0">
      <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden>
        <circle cx="50" cy="50" r="42" fill="none" strokeWidth="9" className="stroke-neutral-200 dark:stroke-neutral-800" />
        <motion.circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          strokeWidth="9"
          strokeLinecap="round"
          stroke="currentColor"
          className={LEVEL_STYLES[level].text}
          initial={{ pathLength: reduceMotion ? score / 100 : 0 }}
          animate={{ pathLength: score / 100 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-3xl font-semibold tabular-nums">
        {score}
      </span>
    </div>
  );
};

interface EssayReviewCardProps {
  review: IEssayReview;
  className?: string;
}

export const EssayReviewCard: FC<EssayReviewCardProps> = ({ review, className }) => {
  const { t, i18n } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [showAll, setShowAll] = useState(false);

  const level = essayScoreLevel(review.score);
  const corrections = showAll ? review.corrections : review.corrections.slice(0, SHOWN_CORRECTIONS);
  const checkedAt = new Date(review.checkedAt).toLocaleString(i18n.language, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <section
      aria-label={t("notes.essay.result.title")}
      className={cn(
        "flex flex-col gap-6 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6 dark:border-neutral-800 dark:bg-neutral-900",
        className,
      )}
    >
      <header className="flex flex-wrap items-center gap-5">
        <ScoreRing score={review.score} level={level} />
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{t("notes.essay.result.overall")}</p>
          <p className={cn("text-2xl font-semibold", LEVEL_STYLES[level].text)}>
            {t(`notes.essay.levels.${level}`)}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {t("notes.essay.result.checkedAt", { date: checkedAt })} ·{" "}
            {t("notes.essay.words", { count: review.wordCount })}
          </p>
        </div>
      </header>

      {review.isTextTruncated && (
        <p className="flex items-start gap-2 rounded-2xl bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
          <LuInfo className="mt-0.5 shrink-0" aria-hidden />
          {t("notes.essay.result.truncated")}
        </p>
      )}

      <ul className="grid gap-3 sm:grid-cols-2">
        {review.criteria.map((criterion, index) => {
          const criterionLevel = essayScoreLevel(criterion.score);

          return (
            <li
              key={criterion.criterion}
              className={cn("flex flex-col gap-2 rounded-2xl p-4", LEVEL_STYLES[criterionLevel].soft)}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-medium">{t(`notes.essay.criteria.${criterion.criterion}`)}</span>
                <span className={cn("text-lg font-semibold tabular-nums", LEVEL_STYLES[criterionLevel].text)}>
                  {criterion.score}
                </span>
              </div>
              <div
                className="h-1.5 overflow-hidden rounded-full bg-white/70 dark:bg-neutral-800"
                role="meter"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={criterion.score}
                aria-label={t(`notes.essay.criteria.${criterion.criterion}`)}
              >
                <motion.div
                  className={cn("h-full origin-left rounded-full", LEVEL_STYLES[criterionLevel].bar)}
                  style={{ width: `${criterion.score}%` }}
                  initial={{ scaleX: reduceMotion ? 1 : 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: reduceMotion ? 0 : 0.15 + index * 0.08, ease: "easeOut" }}
                />
              </div>
              {criterion.comment && (
                <p className="text-sm text-neutral-600 dark:text-neutral-300">{criterion.comment}</p>
              )}
            </li>
          );
        })}
      </ul>

      {(review.strengths.length > 0 || review.improvements.length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {review.strengths.length > 0 && (
            <div className="flex flex-col gap-2">
              <h4 className="flex items-center gap-2 text-sm! font-semibold! text-emerald-700 dark:text-emerald-400">
                <LuCircleCheck aria-hidden /> {t("notes.essay.result.strengths")}
              </h4>
              <ul className="flex flex-col gap-1.5 text-sm text-neutral-700 dark:text-neutral-300">
                {review.strengths.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {review.improvements.length > 0 && (
            <div className="flex flex-col gap-2">
              <h4 className="flex items-center gap-2 text-sm! font-semibold! text-amber-700 dark:text-amber-400">
                <LuLightbulb aria-hidden /> {t("notes.essay.result.improvements")}
              </h4>
              <ol className="flex flex-col gap-1.5 text-sm text-neutral-700 dark:text-neutral-300">
                {review.improvements.map((point, index) => (
                  <li key={point} className="flex gap-2">
                    <span className="font-mono text-xs leading-5 text-amber-600 dark:text-amber-400">{index + 1}.</span>
                    {point}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h4 className="flex items-center gap-2 text-sm! font-semibold!">
          <LuSpellCheck aria-hidden /> {t("notes.essay.result.corrections")}
          {review.corrections.length > 0 && (
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium tabular-nums dark:bg-neutral-800">
              {review.corrections.length}
            </span>
          )}
        </h4>

        {review.corrections.length === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{t("notes.essay.result.noCorrections")}</p>
        ) : (
          <ul className="flex flex-col divide-y divide-neutral-100 dark:divide-neutral-800">
            {corrections.map((correction) => (
              <li key={`${correction.original}→${correction.correction}`} className="flex flex-col gap-1.5 py-3 first:pt-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                    {t(`notes.essay.categories.${correction.category}`)}
                  </span>
                  <span className="break-words text-rose-600 line-through decoration-rose-400/70 dark:text-rose-400">
                    {correction.original}
                  </span>
                  <LuArrowRight className="shrink-0 text-neutral-400" aria-hidden />
                  <span className="break-words font-medium text-emerald-700 dark:text-emerald-400">
                    {correction.correction}
                  </span>
                </div>
                {correction.explanation && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{correction.explanation}</p>
                )}
              </li>
            ))}
          </ul>
        )}

        {review.corrections.length > SHOWN_CORRECTIONS && (
          <button
            type="button"
            onClick={() => setShowAll((value) => !value)}
            className="self-start text-sm font-medium text-neutral-600 underline-offset-4 hover:underline dark:text-neutral-300"
          >
            {showAll
              ? t("notes.essay.result.showLess")
              : t("notes.essay.result.showAll", { count: review.corrections.length })}
          </button>
        )}
      </div>
    </section>
  );
};
