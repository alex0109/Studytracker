"use client";

import { motion } from "framer-motion";
import { useStatisticsDifficultyBreakdown } from "../hooks";
import { QuestionDifficultyEnum } from "@/entities/question/model/question-difficulty";
import { AccuracyRing } from "./AccuracyRing";
import { Card, CardSkeleton } from "./primitives";
import { difficultyLabel, formatDuration, normalizeDifficulty } from "./tokens";

const ORDER: QuestionDifficultyEnum[] = [
  QuestionDifficultyEnum.Easy,
  QuestionDifficultyEnum.Medium,
  QuestionDifficultyEnum.Hard,
];

export function DifficultyRings() {
  const {
    statisticsDifficultyBreakdownData,
    statisticsDifficultyBreakdownIsPending,
  } = useStatisticsDifficultyBreakdown();

  if (statisticsDifficultyBreakdownIsPending)
    return <CardSkeleton className="h-56" />;

  const byDifficulty = new Map(
    (statisticsDifficultyBreakdownData ?? []).map((d) => [
      normalizeDifficulty(d.difficulty),
      d,
    ]),
  );

  return (
    <Card title="By difficulty" subtitle="Accuracy and average time per answer">
      <div className="grid grid-cols-3 gap-2">
        {ORDER.map((difficulty) => {
          const stat = byDifficulty.get(difficulty);
          return (
            <motion.div
              key={difficulty}
              className="flex flex-col items-center rounded-2xl p-2 hover:bg-neutral-800/50"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <AccuracyRing
                accuracy={stat?.accuracy ?? 0}
                label={difficultyLabel[difficulty]}
              />
              <span className="mt-2 text-sm text-neutral-50">
                {difficultyLabel[difficulty]}
              </span>
              <span className="text-xs text-neutral-500">
                {stat ? formatDuration(stat.averageTimeSpent) : "No data"}
              </span>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
