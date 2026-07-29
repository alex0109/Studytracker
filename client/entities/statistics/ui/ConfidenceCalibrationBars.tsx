"use client";

import { useStatisticsConfidenceCalibration } from "../hooks";
import { confidenceLabel } from "./tokens";

export function ConfidenceCalibrationBars() {
  const {
    statisticsConfidenceCalibrationData,
    statisticsConfidenceCalibrationLoading,
  } = useStatisticsConfidenceCalibration();

  if (statisticsConfidenceCalibrationLoading) {
    return (
      <div className="h-52 animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900" />
    );
  }

  const data = statisticsConfidenceCalibrationData ?? [];

  if (data.length === 0) {
    return (
      <div className="flex h-52 flex-col items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900 text-center p-5">
        <p className="text-neutral-500">
          Answer a few questions with confidence set to see this.
        </p>
      </div>
    );
  }

  const maxGap = Math.max(10, ...data.map((d) => Math.abs(d.calibrationGap)));

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <h3 className="mb-1 text-lg text-neutral-50">Confidence calibration</h3>
      <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.15em] text-neutral-500">
        left = overconfident, right = underconfident
      </p>

      <div className="space-y-4">
        {data.map((row) => {
          const gap = row.calibrationGap;
          const widthPct = (Math.abs(gap) / maxGap) * 50;
          const isOverconfident = gap < 0;

          return (
            <div key={row.confidenceLevel} className="flex items-center gap-3">
              <span className="w-16 shrink-0 text-sm text-neutral-50">
                {confidenceLabel[row.confidenceLevel]}
              </span>

              <div className="relative h-4 flex-1">
                <div className="absolute left-1/2 top-0 h-full w-px bg-neutral-700" />
                <div
                  className="absolute top-0 h-full rounded-sm bg-neutral-300"
                  style={{
                    width: `${widthPct}%`,
                    right: isOverconfident ? "50%" : undefined,
                    left: isOverconfident ? undefined : "50%",
                  }}
                />
              </div>

              <span className="w-16 shrink-0 text-right font-mono text-xs text-neutral-500">
                {gap > 0 ? "+" : ""}
                {Math.round(gap)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
