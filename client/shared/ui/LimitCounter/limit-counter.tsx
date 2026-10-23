import { FC } from "react";
import { cn } from "@/shared/lib/cn";

interface LimitCounterProps {
  used: number;
  max?: number;
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
  if (max === undefined) return null;

  const ratio = used / max;
  const isFull = used >= max;

  return (
    <span
      title={
        isFull
          ? `Limit reached: ${max} ${label}`
          : `${used} of ${max} ${label} used`
      }
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium tabular-nums",
        isFull
          ? "bg-red-100 text-red-600"
          : ratio >= 0.8
            ? "bg-amber-100 text-amber-700"
            : "bg-neutral-200 text-neutral-600",
        className,
      )}
    >
      {used}/{max}
    </span>
  );
};
