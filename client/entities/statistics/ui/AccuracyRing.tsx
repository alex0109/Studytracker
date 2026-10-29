"use client";

import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";
import { accuracyTone, useChartColors } from "./tokens";
import { useTranslation } from "react-i18next";
import { useChartAnimation } from "../lib/motion";

type Props = {
  accuracy: number;
  size?: number;
  label?: string;
  large?: boolean;
};

export function AccuracyRing({ accuracy, size = 96, label, large }: Props) {
  const { t } = useTranslation();
  const colors = useChartColors();
  const animated = useChartAnimation();
  const tone = accuracyTone(accuracy);

  return (
    <div
      role="img"
      aria-label={`${label ?? t("statistics.accuracy")}: ${Math.round(accuracy)}%`}
      className="relative shrink-0"
      style={{ width: size, height: size }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          data={[{ value: accuracy }]}
          innerRadius={large ? "80%" : "78%"}
          outerRadius="100%"
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar
            dataKey="value"
            cornerRadius={12}
            fill={tone.hex}
            background={{ fill: colors.grid }}
            isAnimationActive={animated}
            animationDuration={900}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <span
        className={`absolute inset-0 flex items-center justify-center font-semibold text-neutral-900 dark:text-neutral-50 ${
          large ? "text-4xl" : "font-mono text-sm"
        }`}
      >
        {Math.round(accuracy)}%
      </span>
    </div>
  );
}
