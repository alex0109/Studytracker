"use client";

import { FC, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";
import { CountUp } from "../../CountUp";

const ROWS = [
  {
    difficulty: "easy",
    weight: 1,
    score: 100,
    styles: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  },
  {
    difficulty: "medium",
    weight: 2,
    score: 92,
    styles: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  },
  {
    difficulty: "hard",
    weight: 3,
    score: 50,
    styles: "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
  },
] as const;

const TOTAL_WEIGHT = ROWS.reduce((acc, row) => acc + row.weight, 0);
const TOTAL =
  ROWS.reduce((acc, row) => acc + row.score * row.weight, 0) / TOTAL_WEIGHT;

export const ScoreDemo: FC = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const reduceMotion = useReducedMotion();

  return (
    <div ref={ref} className="flex flex-col gap-4">
      <ul className="flex flex-col gap-3">
        {ROWS.map((row, index) => (
          <li
            key={row.difficulty}
            className="flex flex-col gap-2 rounded-2xl border border-neutral-100 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                    row.styles,
                  )}
                >
                  {t(`questions.difficulty.${row.difficulty}`)} ×{row.weight}
                </span>
                <span className="truncate text-sm text-neutral-600 dark:text-neutral-400">
                  {t(`landing.demo.score.methods.${row.difficulty}`)}
                </span>
              </div>
              <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                {row.score}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
              <motion.div
                className="h-full origin-left rounded-full bg-emerald-500"
                initial={{ scaleX: reduceMotion ? row.score / 100 : 0 }}
                animate={{ scaleX: isInView ? row.score / 100 : 0 }}
                transition={{ delay: 0.15 * index, duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-col items-start justify-between gap-3 rounded-2xl bg-neutral-900 p-5 text-white sm:flex-row sm:items-center dark:border dark:border-neutral-800">
        <code className="text-sm text-neutral-300">
          ({ROWS.map((row) => `${row.score}×${row.weight}`).join(" + ")}) ÷{" "}
          {TOTAL_WEIGHT}
        </code>
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-neutral-400">{t("landing.demo.score.total")}</span>
          <CountUp
            value={TOTAL}
            decimals={1}
            className="text-4xl font-semibold text-emerald-400"
          />
        </div>
      </div>
    </div>
  );
};
