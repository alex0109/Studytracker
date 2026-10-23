"use client";

import { FC, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/shared/lib";
import { CountUp } from "../../CountUp";

const ROWS = [
  {
    difficulty: "Easy",
    weight: 1,
    method: "Open · exact match",
    score: 100,
    styles: "bg-emerald-50 text-emerald-700",
  },
  {
    difficulty: "Medium",
    weight: 2,
    method: "Open · fuzzy match, typo forgiven",
    score: 92,
    styles: "bg-amber-50 text-amber-700",
  },
  {
    difficulty: "Hard",
    weight: 3,
    method: "Options · 1 of 2 right picks",
    score: 50,
    styles: "bg-rose-50 text-rose-700",
  },
];

const TOTAL_WEIGHT = ROWS.reduce((acc, row) => acc + row.weight, 0);
const TOTAL =
  ROWS.reduce((acc, row) => acc + row.score * row.weight, 0) / TOTAL_WEIGHT;

export const ScoreDemo: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const reduceMotion = useReducedMotion();

  return (
    <div ref={ref} className="flex flex-col gap-4">
      <ul className="flex flex-col gap-3">
        {ROWS.map((row, index) => (
          <li
            key={row.difficulty}
            className="flex flex-col gap-2 rounded-2xl border border-neutral-100 bg-white p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                    row.styles,
                  )}
                >
                  {row.difficulty} ×{row.weight}
                </span>
                <span className="truncate text-sm text-neutral-600">
                  {row.method}
                </span>
              </div>
              <span className="font-mono font-semibold text-neutral-900">
                {row.score}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
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

      <div className="flex flex-col items-start justify-between gap-3 rounded-2xl bg-neutral-900 p-5 text-white sm:flex-row sm:items-center">
        <code className="text-sm text-neutral-300">
          ({ROWS.map((row) => `${row.score}×${row.weight}`).join(" + ")}) ÷{" "}
          {TOTAL_WEIGHT}
        </code>
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-neutral-400">attempt score</span>
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
