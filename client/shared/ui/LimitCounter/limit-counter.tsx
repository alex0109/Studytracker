"use client";

import { FC } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/cn";

interface LimitCounterProps {
  used: number;
  // null: the plan has no limit here, so there is nothing to count down
  max?: number | null;
  // What is counted, for the tooltip: "materials", "words"...
  label: string;
  className?: string;
}

export const LimitCounter: FC<LimitCounterProps> = ({
  used,
  max,
  label,
  className,
}) => {
  const { t } = useTranslation();

  if (max === undefined || max === null) return null;

  const ratio = used / max;
  const isFull = used >= max;

  return (
    <span
      title={
        isFull
          ? t("limits.counterFull", { max, label })
          : t("limits.counterUsed", { used, max, label })
      }
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium tabular-nums",
        isFull
          ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300"
          : ratio >= 0.8
            ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
            : "bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300",
        className,
      )}
    >
      {used}/{max}
    </span>
  );
};
