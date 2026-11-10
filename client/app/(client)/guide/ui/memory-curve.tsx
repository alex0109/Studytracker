"use client";

import { FC } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "@/shared/i18n";

const WIDTH = 320;
const HEIGHT = 140;
const TOP = 12;
const BOTTOM = HEIGHT - 22;
// Days of the reviews and the memory stability after each one
const REVIEWS = [
  { day: 0, stability: 1.2 },
  { day: 2, stability: 4 },
  { day: 7, stability: 11 },
  { day: 18, stability: 30 },
];
const LAST_DAY = 30;
const TARGET = 0.9;

const x = (day: number) => 16 + (day / LAST_DAY) * (WIDTH - 32);
const y = (recall: number) => TOP + (1 - recall) * (BOTTOM - TOP) * 2.2;

// Recall drops after each review, slower every time; a review comes when it nears the target
const curve = () =>
  REVIEWS.map((review, index) => {
    const end = REVIEWS[index + 1]?.day ?? LAST_DAY;
    const points: string[] = [];
    for (let day = review.day; day <= end; day += 0.25) {
      const recall = Math.pow(1 + (19 / 81) * ((day - review.day) / review.stability), -0.5);
      points.push(`${x(day).toFixed(1)},${y(recall).toFixed(1)}`);
    }
    return `M${points.join(" L")}`;
  });

export const MemoryCurve: FC = () => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  return (
    <figure className="flex flex-col gap-3">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={t("guide.hood.memory.chart")}>
        <line x1={16} x2={WIDTH - 16} y1={y(TARGET)} y2={y(TARGET)} className="stroke-amber-400" strokeDasharray="4 4" strokeWidth={1} />
        <text x={WIDTH - 16} y={y(TARGET) - 4} textAnchor="end" className="fill-amber-600 text-[9px] dark:fill-amber-400">
          {t("guide.hood.memory.target")}
        </text>
        <line x1={16} x2={WIDTH - 16} y1={BOTTOM + 6} y2={BOTTOM + 6} className="stroke-neutral-200 dark:stroke-neutral-800" />
        {curve().map((path, index) => (
          <motion.path
            key={path}
            d={path}
            fill="none"
            strokeWidth={2.5}
            strokeLinecap="round"
            className="stroke-sky-500"
            initial={{ pathLength: reduceMotion ? 1 : 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: reduceMotion ? 0 : index * 0.55, ease: "easeOut" }}
          />
        ))}
        {REVIEWS.map((review, index) => (
          <motion.g
            key={review.day}
            initial={{ opacity: reduceMotion ? 1 : 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: reduceMotion ? 0 : index * 0.55 }}
          >
            <circle cx={x(review.day)} cy={y(1)} r={4} className="fill-emerald-500" />
            <text x={x(review.day)} y={BOTTOM + 18} textAnchor="middle" className="fill-neutral-500 text-[9px]">
              {t("guide.hood.memory.day", { day: review.day })}
            </text>
          </motion.g>
        ))}
      </svg>
      <figcaption className="text-xs text-neutral-500">{t("guide.hood.memory.caption")}</figcaption>
    </figure>
  );
};
