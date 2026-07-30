"use client";

import { useStatisticsTagPerformance } from "../hooks";

export function TagPerformanceList() {
  const { statisticsTagPerformanceData, statisticsTagPerformanceIsPending } =
    useStatisticsTagPerformance();

  if (statisticsTagPerformanceIsPending) {
    return (
      <div className="h-52 animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900" />
    );
  }

  const tags = statisticsTagPerformanceData ?? [];

  if (tags.length === 0) {
    return (
      <div className="flex h-52 flex-col items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900 text-center p-5">
        <p className="text-neutral-500">
          Tag materials to see which topics need work.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <h3 className="mb-5 text-lg text-neutral-50">
        Focus areas — weakest first
      </h3>

      <div className="space-y-3">
        {tags.map((tag, i) => (
          <div key={tag.tagId} className="flex items-center gap-3">
            <span className="w-6 shrink-0 font-mono text-xs text-neutral-500">
              {String(i + 1).padStart(2, "0")}
            </span>

            <span className="w-28 shrink-0 truncate text-sm text-neutral-50">
              {tag.tagName}
            </span>

            <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-800">
              <div
                className="h-full rounded-full bg-neutral-300"
                style={{ width: `${tag.accuracy}%` }}
              />
            </div>

            <span className="w-12 shrink-0 text-right font-mono text-xs text-neutral-300">
              {Math.round(tag.accuracy)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
