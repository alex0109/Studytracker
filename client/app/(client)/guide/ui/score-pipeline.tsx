"use client";

import { FC, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LuArrowRight, LuCheck, LuMinus, LuX } from "react-icons/lu";
import { cn } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";

type Stage = "exact" | "fuzzy" | "ai" | "score";
type Mark = "pass" | "fail" | "skip" | "gray";

// Answers to "What pigment captures light?"; the right one is "chlorophyll"
const EXAMPLES: { id: "exact" | "typo" | "meaning" | "wrong"; answer: string; marks: Record<Exclude<Stage, "score">, Mark>; score: number }[] = [
  { id: "exact", answer: "chlorophyll", marks: { exact: "pass", fuzzy: "skip", ai: "skip" }, score: 100 },
  { id: "typo", answer: "chlorofyll", marks: { exact: "fail", fuzzy: "pass", ai: "skip" }, score: 91 },
  { id: "meaning", answer: "the green pigment in leaves", marks: { exact: "fail", fuzzy: "gray", ai: "pass" }, score: 85 },
  { id: "wrong", answer: "water", marks: { exact: "fail", fuzzy: "fail", ai: "skip" }, score: 0 },
];

const STAGES: Stage[] = ["exact", "fuzzy", "ai", "score"];

const MARK_STYLES: Record<Mark, string> = {
  pass: "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40",
  fail: "border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/30",
  gray: "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40",
  skip: "border-neutral-200 bg-white opacity-50 dark:border-neutral-800 dark:bg-neutral-900",
};

const MarkIcon: FC<{ mark: Mark }> = ({ mark }) =>
  mark === "pass" ? (
    <LuCheck className="text-emerald-600" aria-hidden />
  ) : mark === "fail" ? (
    <LuX className="text-rose-500" aria-hidden />
  ) : mark === "gray" ? (
    <span className="text-xs font-semibold text-amber-600" aria-hidden>~</span>
  ) : (
    <LuMinus className="text-neutral-400" aria-hidden />
  );

// Pick an answer and watch which checks it goes through before it gets its score
export const ScorePipeline: FC = () => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [exampleId, setExampleId] = useState<(typeof EXAMPLES)[number]["id"]>("typo");
  const example = EXAMPLES.find((item) => item.id === exampleId)!;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <span className="text-sm text-neutral-500">
          {t("guide.hood.score.question")} <span lang="en" className="font-medium text-neutral-800 dark:text-neutral-200">What pigment captures light?</span>
        </span>
        <div role="radiogroup" aria-label={t("guide.hood.score.pick")} className="flex flex-wrap gap-2">
          {EXAMPLES.map((item) => (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={item.id === exampleId}
              onClick={() => setExampleId(item.id)}
              lang="en"
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm transition",
                item.id === exampleId
                  ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                  : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300",
              )}
            >
              “{item.answer}”
            </button>
          ))}
        </div>
      </div>

      <ol className="grid gap-2 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-stretch">
        {STAGES.map((stage, index) => {
          const isScore = stage === "score";
          const mark: Mark = isScore ? (example.score >= 70 ? "pass" : "fail") : example.marks[stage];

          return (
            <li key={stage} className="contents">
              <motion.div
                layout={!reduceMotion}
                className={cn("flex flex-col gap-1.5 rounded-2xl border p-3 transition-colors duration-300", MARK_STYLES[mark])}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold">{t(`guide.hood.score.steps.${stage}.title`)}</span>
                  {isScore ? (
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={example.score}
                        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="text-lg font-semibold tabular-nums"
                      >
                        {example.score}
                      </motion.span>
                    </AnimatePresence>
                  ) : (
                    <MarkIcon mark={mark} />
                  )}
                </div>
                <span className="text-xs text-neutral-600 dark:text-neutral-400">{t(`guide.hood.score.steps.${stage}.text`)}</span>
              </motion.div>
              {index < STAGES.length - 1 && (
                <LuArrowRight aria-hidden className="mx-auto hidden self-center text-neutral-300 md:block dark:text-neutral-600" />
              )}
            </li>
          );
        })}
      </ol>

      <AnimatePresence mode="wait">
        <motion.p
          key={example.id}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="rounded-2xl bg-neutral-50 p-3 text-sm text-neutral-700 dark:bg-neutral-950/50 dark:text-neutral-300"
        >
          {t(`guide.hood.score.examples.${example.id}`)}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};
