"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartLine, TrendingDown, TrendingUp } from "lucide-react";
import { useStatisticsAttemtTrend, useStatisticsOverview } from "../hooks";
import { Card, CardEmpty, CardSkeleton, TooltipShell } from "./primitives";
import { COLORS, formatShortDate, useChartColors } from "./tokens";
import { useTranslation } from "react-i18next";
import { useChartAnimation } from "../lib/motion";

type Row = {
  label: string;
  score: number;
  attempts: number;
  band: [number, number] | null;
};

function TrendTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: Row }[];
}) {
  const { t } = useTranslation();
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <TooltipShell>
      <p className="mb-1 text-neutral-500">{row.label}</p>
      <p className="font-medium text-neutral-900 dark:text-neutral-50">
        {t("statistics.trend.tooltipScore", { score: row.score })}
      </p>
      <p className="text-neutral-500 dark:text-neutral-400">
        {t("statistics.trend.tooltipAttempts", { count: row.attempts })}
      </p>
    </TooltipShell>
  );
}

export function AttemptTrendChart() {
  const { statisticsAttemtTrendData, statisticsAttemtTrendIsPending } =
    useStatisticsAttemtTrend();
  const { statisticsOverviewData } = useStatisticsOverview();
  const animated = useChartAnimation();
  const colors = useChartColors();
  const { t, i18n } = useTranslation();

  if (statisticsAttemtTrendIsPending)
    return <CardSkeleton className="h-72 md:col-span-2" />;

  const trend = statisticsAttemtTrendData ?? [];

  if (trend.length === 0) {
    return (
      <CardEmpty
        className="h-72 md:col-span-2"
        icon={<ChartLine className="h-8 w-8" aria-hidden />}
        text={t("statistics.trend.empty")}
      />
    );
  }

  const mean = statisticsOverviewData?.averageScorePerAttempt ?? null;
  const consistency = statisticsOverviewData?.consistencyScore ?? 0;
  const band: [number, number] | null =
    mean === null
      ? null
      : [Math.max(0, mean - consistency), Math.min(100, mean + consistency)];

  const data: Row[] = trend.map((p) => ({
    label: formatShortDate(new Date(p.date), i18n.language),
    score: Math.round(p.averageScore * 10) / 10,
    attempts: p.attemptsCount,
    band,
  }));

  const delta =
    data.length > 1
      ? data[data.length - 1].score - data[data.length - 2].score
      : null;
  const up = (delta ?? 0) >= 0;

  return (
    <Card
      className="md:col-span-2"
      title={t("statistics.trend.title")}
      subtitle={band ? t("statistics.trend.band") : undefined}
      action={
        delta !== null && (
          <span
            className={`flex items-center gap-1 rounded-2xl px-3 py-1 text-sm font-medium ${
              up
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                : "bg-rose-500/10 text-rose-700 dark:text-rose-400"
            }`}
          >
            {up ? (
              <TrendingUp className="h-4 w-4" aria-hidden />
            ) : (
              <TrendingDown className="h-4 w-4" aria-hidden />
            )}
            {up ? "+" : ""}
            {t("statistics.trend.delta", { delta: delta.toFixed(1) })}
          </span>
        )
      }
    >
      <div
        role="img"
        aria-label={t("statistics.trend.chartLabel")}
        className="h-56"
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 8, bottom: 0, left: -12 }}
          >
            <defs>
              <linearGradient
                id="attempt-score-fill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={COLORS.emerald}
                  stopOpacity={0.35}
                />
                <stop
                  offset="100%"
                  stopColor={COLORS.emerald}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={colors.grid} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: colors.tick, fontSize: 11 }}
              minTickGap={24}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 50, 100]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: colors.tick, fontSize: 11 }}
              width={40}
            />
            <Tooltip
              content={<TrendTooltip />}
              cursor={{ stroke: colors.tick, strokeDasharray: 4 }}
            />
            {band && (
              <Area
                dataKey="band"
                stroke="none"
                fill={colors.line}
                fillOpacity={0.1}
                isAnimationActive={animated}
                activeDot={false}
              />
            )}
            <Area
              dataKey="score"
              type="monotone"
              stroke={COLORS.emerald}
              strokeWidth={2.5}
              fill="url(#attempt-score-fill)"
              dot={{ r: 3, fill: COLORS.emerald, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
              isAnimationActive={animated}
              animationDuration={1000}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
