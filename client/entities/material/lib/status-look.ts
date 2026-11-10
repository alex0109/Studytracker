import type { MaterialStatusEnum } from "../model";

// One colour per stage, the same wherever a status is shown: grey to learn, amber in
// progress, green when finished
export const STATUS_LOOK: Record<`${MaterialStatusEnum}`, { dot: string; pill: string }> = {
  tolearn: {
    dot: "bg-neutral-400",
    pill: "border-neutral-200 bg-white/70 text-neutral-700 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-200",
  },
  inprocess: {
    dot: "bg-amber-500",
    pill: "border-amber-200 bg-amber-50 text-amber-800 hover:border-amber-300 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
  },
  finished: {
    dot: "bg-emerald-500",
    pill: "border-emerald-200 bg-emerald-50 text-emerald-800 hover:border-emerald-300 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
};
