import { FC } from "react";
import { cn } from "@/shared/lib/cn";

interface LimitBarProps {
  label: string;
  used: number;
  max: number;
  hint?: string;
  className?: string;
}

// One limit as a labelled progress bar: green while there is room, amber near the end, red when full
export const LimitBar: FC<LimitBarProps> = ({
  label,
  used,
  max,
  hint,
  className,
}) => {
  const ratio = max > 0 ? Math.min(used / max, 1) : 1;
  const isFull = used >= max;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="min-w-0 truncate text-neutral-700 dark:text-neutral-200">
          {label}
        </span>
        <span
          className={cn(
            "shrink-0 tabular-nums font-medium",
            isFull ? "text-red-600" : "text-neutral-500",
          )}
        >
          {used} / {max}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={used}
        className="h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700"
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-500",
            isFull
              ? "bg-red-500"
              : ratio >= 0.8
                ? "bg-amber-500"
                : "bg-emerald-500",
          )}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
      {hint && <span className="text-xs text-neutral-500">{hint}</span>}
    </div>
  );
};
