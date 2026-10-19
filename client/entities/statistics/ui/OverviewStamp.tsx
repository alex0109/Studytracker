"use client";

import { BookOpen, CircleHelp, ListChecks, Timer } from "lucide-react";
import { useStatisticsOverview } from "../hooks";
import { AccuracyRing } from "./AccuracyRing";
import { AnimatedNumber, Card, CardSkeleton } from "./primitives";
import { accuracyTone, formatDuration } from "./tokens";

export function OverviewStamp() {
  const { statisticsOverviewData, statisticsOverviewIsPending } =
    useStatisticsOverview();

  if (statisticsOverviewIsPending || !statisticsOverviewData) {
    return <CardSkeleton className="h-64 md:col-span-2" />;
  }

  const {
    totalMaterials,
    totalQuestions,
    totalFinishedAttempts,
    overallAccuracy,
    averageTimePerQuestion,
    totalTimeSpent,
  } = statisticsOverviewData;

  const tone = accuracyTone(overallAccuracy);

  const tiles = [
    {
      label: "Materials",
      value: <AnimatedNumber value={totalMaterials} />,
      icon: BookOpen,
    },
    {
      label: "Questions",
      value: <AnimatedNumber value={totalQuestions} />,
      icon: CircleHelp,
    },
    {
      label: "Attempts",
      value: <AnimatedNumber value={totalFinishedAttempts} />,
      icon: ListChecks,
    },
    {
      label: "Avg per question",
      value: formatDuration(averageTimePerQuestion),
      icon: Timer,
    },
  ];

  return (
    <Card className="md:col-span-2">
      <div className="flex flex-col items-center gap-8 md:flex-row md:gap-10">
        <div className="flex flex-col items-center gap-3">
          <AccuracyRing accuracy={overallAccuracy} size={176} large />
          <span
            className={`rounded-2xl px-3 py-1 text-xs font-medium ${tone.badge}`}
          >
            {tone.label} overall accuracy
          </span>
        </div>

        <div className="w-full flex-1">
          <div className="grid grid-cols-2 gap-3">
            {tiles.map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-2xl bg-neutral-800/50 p-4">
                <Icon className="mb-3 h-5 w-5 text-emerald-500" aria-hidden />
                <p className="text-2xl font-semibold tabular-nums text-neutral-50">
                  {value}
                </p>
                <p className="mt-1 text-sm text-neutral-500">{label}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-neutral-500">
            Total study time:{" "}
            <span className="text-neutral-300">
              {formatDuration(totalTimeSpent)}
            </span>
          </p>
        </div>
      </div>
    </Card>
  );
}
