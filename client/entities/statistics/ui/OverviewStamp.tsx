"use client";

import { useStatisticsOverview } from "../hooks";
import { formatDuration } from "./tokens";

export function OverviewStamp() {
  const { statisticsOverviewData, statisticsOverviewLoading } =
    useStatisticsOverview();

  if (statisticsOverviewLoading || !statisticsOverviewData) {
    return (
      <div className="h-56 animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900" />
    );
  }

  const {
    totalMaterials,
    totalQuestions,
    totalFinishedAttempts,
    overallAccuracy,
    averageTimePerQuestion,
  } = statisticsOverviewData;

  const stats: { label: string; value: string }[] = [
    { label: "Materials", value: String(totalMaterials) },
    { label: "Questions", value: String(totalQuestions) },
    { label: "Attempts", value: String(totalFinishedAttempts) },
    { label: "Avg / question", value: formatDuration(averageTimePerQuestion) },
  ];

  return (
    <div className="flex flex-col items-center gap-10 rounded-2xl lg:p-8 sm:flex-row sm:items-stretch sm:justify-between">
      <div className="flex items-center justify-center">
        <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-2 border-dashed border-emerald-800">
          <div className="flex flex-col items-center">
            <span className="text-4xl font-semibold leading-none text-black">
              {Math.round(overallAccuracy)}
              <span className="text-xl">%</span>
            </span>
            <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-black">
              Accuracy
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 grid-cols-2 gap-6 sm:grid-cols-4 justify-center items-center">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col justify-end">
            <span className="font-mono text-2xl text-black">{stat.value}</span>
            <span className="mt-1 text-sm italic text-black">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
