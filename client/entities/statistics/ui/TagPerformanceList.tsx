"use client";

import { motion } from "framer-motion";
import { Tags } from "lucide-react";
import { useStatisticsTagPerformance } from "../hooks";
import { Card, CardEmpty, CardSkeleton } from "./primitives";
import { accuracyTone } from "./tokens";

export function TagPerformanceList() {
  const { statisticsTagPerformanceData, statisticsTagPerformanceIsPending } =
    useStatisticsTagPerformance();

  if (statisticsTagPerformanceIsPending)
    return <CardSkeleton className="h-56 md:col-span-2" />;

  const tags = statisticsTagPerformanceData ?? [];

  if (tags.length === 0) {
    return (
      <CardEmpty
        className="h-56 md:col-span-2"
        icon={<Tags className="h-8 w-8" aria-hidden />}
        text="Add tags to your materials to see which topics need more work."
      />
    );
  }

  return (
    <Card
      className="md:col-span-2"
      title="Focus areas"
      subtitle="Weakest topics first"
    >
      <ul className="space-y-4">
        {tags.map((tag, i) => {
          const tone = accuracyTone(tag.accuracy);
          return (
            <li key={tag.tagId} className="flex items-center gap-3">
              <span
                className="w-28 shrink-0 truncate text-sm text-neutral-50 sm:w-40"
                title={tag.tagName}
              >
                {tag.tagName}
              </span>

              <div
                role="progressbar"
                aria-valuenow={Math.round(tag.accuracy)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${tag.tagName} accuracy`}
                className="h-2.5 flex-1 overflow-hidden rounded-2xl bg-neutral-800"
              >
                <motion.div
                  className={`h-full rounded-2xl ${tone.bar}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${tag.accuracy}%` }}
                  transition={{
                    duration: 0.8,
                    delay: 0.1 + i * 0.05,
                    ease: "easeOut",
                  }}
                />
              </div>

              <span
                className={`w-12 shrink-0 text-right font-mono text-sm tabular-nums ${tone.text}`}
              >
                {Math.round(tag.accuracy)}%
              </span>
              <span className="hidden w-20 shrink-0 text-right text-xs text-neutral-500 sm:block">
                {tag.answersCount} answers
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
