"use client";

import { useStatisticsDifficultyBreakdown } from "../hooks";
import { QuestionDifficultyEnum } from "@/entities/question/model/question-difficulty";
import { difficultyLabel, formatDuration, normalizeDifficulty } from "./tokens";

const ORDER: QuestionDifficultyEnum[] = [
  QuestionDifficultyEnum.Easy,
  QuestionDifficultyEnum.Medium,
  QuestionDifficultyEnum.Hard,
];
const RADIUS = 30;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const RING_COLOR = "#e5e5e5";
const TRACK_COLOR = "#404040";

export function DifficultyRings() {
  const {
    statisticsDifficultyBreakdownData,
    statisticsDifficultyBreakdownLoading,
  } = useStatisticsDifficultyBreakdown();

  if (statisticsDifficultyBreakdownLoading) {
    return (
      <div className="h-52 animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900" />
    );
  }

  const byDifficulty = new Map(
    (statisticsDifficultyBreakdownData ?? []).map((d) => [
      normalizeDifficulty(d.difficulty),
      d,
    ]),
  );

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <h3 className="mb-5 text-lg text-neutral-50">By difficulty</h3>

      <div className="grid grid-cols-3 gap-4">
        {ORDER.map((difficulty) => {
          const stat = byDifficulty.get(difficulty);
          const accuracy = stat?.accuracy ?? 0;
          const offset = CIRCUMFERENCE - (accuracy / 100) * CIRCUMFERENCE;

          return (
            <div key={difficulty} className="flex flex-col items-center">
              <svg width={72} height={72} viewBox="0 0 72 72">
                <circle
                  cx={36}
                  cy={36}
                  r={RADIUS}
                  fill="none"
                  stroke={TRACK_COLOR}
                  strokeWidth={6}
                />
                <circle
                  cx={36}
                  cy={36}
                  r={RADIUS}
                  fill="none"
                  stroke={RING_COLOR}
                  strokeWidth={6}
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={offset}
                  transform="rotate(-90 36 36)"
                />
                <text
                  x={36}
                  y={41}
                  textAnchor="middle"
                  className="font-mono"
                  fontSize={14}
                  fill="#fafafa"
                >
                  {Math.round(accuracy)}%
                </text>
              </svg>

              <span className="mt-2 text-sm text-neutral-50">
                {difficultyLabel[difficulty]}
              </span>
              <span className="font-mono text-[11px] text-neutral-500">
                {stat ? formatDuration(stat.averageTimeSpent) : "—"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
