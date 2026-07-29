"use client";

import { VictoryArea, VictoryAxis, VictoryChart, VictoryLine } from "victory";
import { useStatisticsAttemtTrend, useStatisticsOverview } from "../hooks";
import moment from "moment";

const LINE_COLOR = "#e5e5e5";
const BAND_COLOR = "#a3a3a3";
const GRID_COLOR = "#262626";
const TICK_COLOR = "#737373";

export function AttemptTrendChart() {
  const { statisticsAttemtTrendData, statisticsAttemtTrendLoading } =
    useStatisticsAttemtTrend();
  const { statisticsOverviewData } = useStatisticsOverview();

  const points = (statisticsAttemtTrendData ?? []).map((p) => ({
    x: new Date(p.date),
    y: p.averageScore,
  }));

  if (statisticsAttemtTrendLoading) {
    return (
      <div className="h-64 animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900" />
    );
  }

  if (points.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900 text-center p-5">
        <p className="text-neutral-500">
          No finished attempts yet — the trend line fills in as you study.
        </p>
      </div>
    );
  }

  const mean = statisticsOverviewData?.averageScorePerAttempt ?? null;
  const consistency = statisticsOverviewData?.consistencyScore ?? 0;

  const bandData =
    mean === null
      ? []
      : points.map((p) => ({
          x: p.x,
          y0: Math.max(0, mean - consistency),
          y: Math.min(100, mean + consistency),
        }));

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="text-lg text-neutral-50">Score over time</h3>
        <span className="font-mono text-xs uppercase tracking-[0.15em] text-neutral-500">
          shaded band = consistency
        </span>
      </div>

      <VictoryChart
        height={220}
        padding={{ top: 10, bottom: 30, left: 36, right: 10 }}
        domain={{ y: [0, 100] }}
      >
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: GRID_COLOR },
            tickLabels: { fill: TICK_COLOR, fontSize: 10 },
            grid: { stroke: "transparent" },
          }}
        />
        <VictoryAxis
          tickFormat={(d: Date) => moment(d).format("D/M")}
          style={{
            axis: { stroke: GRID_COLOR },
            tickLabels: { fill: TICK_COLOR, fontSize: 10 },
          }}
        />

        {bandData.length > 0 && (
          <VictoryArea
            data={bandData}
            style={{ data: { fill: BAND_COLOR, opacity: 0.15 } }}
          />
        )}

        <VictoryLine
          data={points}
          style={{ data: { stroke: LINE_COLOR, strokeWidth: 2 } }}
        />
      </VictoryChart>
    </div>
  );
}
