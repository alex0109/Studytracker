"use client";

import { motion } from "framer-motion";
import { useStatisticsDifficultyBreakdown } from "../hooks";
import { QuestionDifficultyEnum } from "@/entities/question/model/question-difficulty";
import { AccuracyRing } from "./AccuracyRing";
import { Card, CardSkeleton } from "./primitives";
import { difficultyKey, normalizeDifficulty, useFormatDuration } from "./tokens";
import { useTranslation } from "react-i18next";

const ORDER: QuestionDifficultyEnum[] = [
  QuestionDifficultyEnum.Easy,
  QuestionDifficultyEnum.Medium,
  QuestionDifficultyEnum.Hard,
];

export function DifficultyRings() {
  const { t } = useTranslation();
  const formatDuration = useFormatDuration();
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
    <Card title={t("statistics.difficulty.title")} subtitle={t("statistics.difficulty.subtitle")}>
      <div className="grid grid-cols-3 gap-2">
        {ORDER.map((difficulty) => {
          const stat = byDifficulty.get(difficulty);
          return (
            <motion.div
              key={difficulty}
              className="flex flex-col items-center rounded-2xl p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <AccuracyRing
                accuracy={stat?.accuracy ?? 0}
                label={t(`questions.difficulty.${difficultyKey[difficulty]}`)}
              />
              <span className="mt-2 text-sm text-neutral-900 dark:text-neutral-50">
                {t(`questions.difficulty.${difficultyKey[difficulty]}`)}
              </span>
              <span className="text-xs text-neutral-500">
                {stat ? formatDuration(stat.averageTimeSpent) : t("statistics.noData")}
              </span>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
