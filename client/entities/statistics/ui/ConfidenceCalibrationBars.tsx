"use client";

import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Gauge } from "lucide-react";
import { useStatisticsConfidenceCalibration } from "../hooks";
import { Card, CardEmpty, CardSkeleton, TooltipShell } from "./primitives";
import {
  COLORS,
  ConfidenceName,
  confidenceRank,
  normalizeConfidence,
  useChartColors,
} from "./tokens";
import { useTranslation } from "react-i18next";

const CONFIDENCE_KEYS = { Low: "low", Medium: "medium", High: "high" } as const;
import { useChartAnimation } from "../lib/motion";

type Row = { name: string; level: ConfidenceName; gap: number; actual: number; count: number };

type LabelProps = {
  x?: unknown;
  y?: unknown;
  width?: unknown;
  height?: unknown;
  value?: unknown;
};

function CalibrationTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: Row }[];
}) {
  const { t } = useTranslation();
  if (!active || !payload?.length) return null;
  const r = payload[0].payload;
  return (
    <TooltipShell>
      <p className="font-medium text-neutral-900 dark:text-neutral-50">{r.name}</p>
      <p className="text-neutral-500 dark:text-neutral-400">
        {t("statistics.calibration.actual", { value: Math.round(r.actual) })}
      </p>
      <p className="text-neutral-500 dark:text-neutral-400">
        {t("statistics.answers", { count: r.count })}
      </p>
    </TooltipShell>
  );
}

export function ConfidenceCalibrationBars() {
  const {
    statisticsConfidenceCalibrationData,
    statisticsConfidenceCalibrationIsPending,
  } = useStatisticsConfidenceCalibration();
  const animated = useChartAnimation();
  const colors = useChartColors();
  const { t } = useTranslation();

  if (statisticsConfidenceCalibrationIsPending)
    return <CardSkeleton className="h-56" />;

  const raw = statisticsConfidenceCalibrationData ?? [];

  if (raw.length === 0) {
    return (
      <CardEmpty
        className="h-56"
        icon={<Gauge className="h-8 w-8" aria-hidden />}
        text={t("statistics.calibration.empty")}
      />
    );
  }

  const data: Row[] = raw
    .map((d) => ({ level: normalizeConfidence(d.confidenceLevel), d }))
    .filter(
      (x): x is { level: ConfidenceName; d: typeof x.d } => x.level !== null,
    )
    .sort((a, b) => confidenceRank(a.level) - confidenceRank(b.level))
    .map(({ level, d }) => ({
      name: t(`attempt.confidence.${CONFIDENCE_KEYS[level]}`),
      level,
      gap: Math.round(d.calibrationGap),
      actual: d.actualAccuracy,
      count: d.answersCount,
    }));

  const max = Math.max(10, ...data.map((d) => Math.abs(d.gap)));
  const worst = data.reduce((a, b) =>
    Math.abs(b.gap) > Math.abs(a.gap) ? b : a,
  );
  const summary =
    Math.abs(worst.gap) < 5
      ? t("statistics.calibration.matches")
      : worst.gap < 0
        ? t("statistics.calibration.over", { level: worst.name })
        : t("statistics.calibration.under", { level: worst.name });

  function GapLabel({ x, y, width, height, value }: LabelProps) {
    const [nx, ny, nw, nh, v] = [x, y, width, height, value].map((n) =>
      Number(n ?? 0),
    );
    const negative = v < 0;
    const edge = negative
      ? Math.min(nx, nx + nw) - 6
      : Math.max(nx, nx + nw) + 6;

    return (
      <text
        x={edge}
        y={ny + nh / 2}
        dy={4}
        fill={colors.tick}
        fontSize={11}
        textAnchor={negative ? "end" : "start"}
      >
        {v > 0 ? `+${v}` : v}
      </text>
    );
  }

  return (
    <Card title={t("statistics.calibration.title")} subtitle={summary}>
      <div
        role="img"
        aria-label={summary}
        style={{ height: data.length * 52 + 16 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 24, bottom: 0, left: 0 }}
            barCategoryGap={12}
          >
            <XAxis type="number" domain={[-max * 1.3, max * 1.3]} hide />
            <YAxis
              type="category"
              dataKey="name"
              width={96}
              tickLine={false}
              axisLine={false}
              tick={{ fill: colors.label, fontSize: 13 }}
            />
            <ReferenceLine x={0} stroke={colors.reference} />
            <Tooltip
              content={<CalibrationTooltip />}
              cursor={{ fill: colors.cursor, opacity: 0.6 }}
            />
            <Bar
              dataKey="gap"
              radius={8}
              isAnimationActive={animated}
              animationDuration={900}
            >
              {data.map((d) => (
                <Cell
                  key={d.level}
                  fill={d.gap < 0 ? COLORS.rose : COLORS.emerald}
                />
              ))}
              <LabelList dataKey="gap" content={GapLabel} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex justify-between text-xs">
        <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
          <span className="h-2 w-2 rounded-2xl bg-rose-500" /> {t("statistics.calibration.overLegend")}
        </span>
        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
          {t("statistics.calibration.underLegend")} <span className="h-2 w-2 rounded-2xl bg-emerald-500" />
        </span>
      </div>
    </Card>
  );
}
