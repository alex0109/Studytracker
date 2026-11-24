import { addDaysIso, addMonthsIso, monthGridIso, startOfWeekIso } from "@/shared/lib";

export type CalendarView = "week" | "month" | "year";
export type DayStatus = "none" | "studied" | "streak";

export const VIEWS: CalendarView[] = ["week", "month", "year"];

export const STATUS_STYLES: Record<DayStatus, string> = {
  none: "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
  studied: "bg-emerald-500 text-white",
  streak: "bg-orange-500 text-white",
};

// The days a view shows: a week, a month in whole weeks, or a year
export const rangeOf = (view: CalendarView, anchor: string) => {
  if (view === "week") {
    const from = startOfWeekIso(anchor);
    return { from, to: addDaysIso(from, 6) };
  }
  if (view === "month") {
    const days = monthGridIso(anchor);
    return { from: days[0], to: days[days.length - 1] };
  }
  // Whole weeks, so the January column starts on Monday like every other
  const year = anchor.slice(0, 4);
  return { from: startOfWeekIso(`${year}-01-01`), to: `${year}-12-31` };
};

// The same place one view further on or back
export const stepAnchor = (view: CalendarView, anchor: string, step: 1 | -1) =>
  view === "week" ? addDaysIso(anchor, 7 * step) : addMonthsIso(anchor, view === "month" ? step : 12 * step);
