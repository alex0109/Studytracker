// SHARED-UI
"use client";

import { FC, KeyboardEvent, useEffect, useRef, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/cn";
import {
  addDaysIso,
  addMonthsIso,
  formatFullDate,
  formatIsoDate,
  monthGridIso,
  startOfMonthIso,
  startOfWeekIso,
  todayIso,
  weekdayNames,
} from "@/shared/lib/dates";

interface DateCalendarProps {
  value: string | null;
  onChange: (iso: string) => void;
  // Days before it can't be picked
  min?: string;
  max?: string;
}

// A month grid for one date. Arrow keys move by day and week, Page keys by month, Home and End
// to the edges of the week: only one day is in the tab order, as in any grid
export const DateCalendar: FC<DateCalendarProps> = ({ value, onChange, min, max }) => {
  const { i18n, t } = useTranslation();
  const language = i18n.language;
  const [today] = useState(todayIso);
  const [focused, setFocused] = useState(value ?? (min && min > today ? min : today));
  const [direction, setDirection] = useState<"next" | "previous">("next");
  const gridRef = useRef<HTMLDivElement>(null);
  const moveFocus = useRef(false);

  const month = startOfMonthIso(focused);
  const days = monthGridIso(month);
  const weeks = Array.from({ length: days.length / 7 }, (_, index) => days.slice(index * 7, index * 7 + 7));
  const isDisabled = (day: string) => (!!min && day < min) || (!!max && day > max);

  const go = (next: string, withFocus: boolean) => {
    if (next.slice(0, 7) !== focused.slice(0, 7)) setDirection(next > focused ? "next" : "previous");
    moveFocus.current = withFocus;
    setFocused(next);
  };

  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-day="${focused}"]`)?.focus();
  }, [focused]);

  const onKeyDown = (event: KeyboardEvent) => {
    const moves: Record<string, string> = {
      ArrowLeft: addDaysIso(focused, -1),
      ArrowRight: addDaysIso(focused, 1),
      ArrowUp: addDaysIso(focused, -7),
      ArrowDown: addDaysIso(focused, 7),
      PageUp: addMonthsIso(focused, -1),
      PageDown: addMonthsIso(focused, 1),
      Home: startOfWeekIso(focused),
      End: addDaysIso(startOfWeekIso(focused), 6),
    };
    const next = moves[event.key];
    if (!next) return;

    event.preventDefault();
    go(next, true);
  };

  const canGoBack = !min || startOfMonthIso(min) < month;
  const canGoForward = !max || startOfMonthIso(max) > month;
  const arrow =
    "flex size-8 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 disabled:pointer-events-none disabled:opacity-30 dark:hover:bg-neutral-800 dark:hover:text-neutral-100";

  return (
    <div className="flex w-[17.5rem] flex-col gap-2">
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label={t("calendar.previousMonth")}
          disabled={!canGoBack}
          onClick={() => go(addMonthsIso(focused, -1), false)}
          className={arrow}
        >
          <LuChevronLeft aria-hidden className="size-4" />
        </button>
        <span aria-live="polite" className="text-sm font-semibold capitalize">
          {formatIsoDate(month, language, { month: "long", year: "numeric" })}
        </span>
        <button
          type="button"
          aria-label={t("calendar.nextMonth")}
          disabled={!canGoForward}
          onClick={() => go(addMonthsIso(focused, 1), false)}
          className={arrow}
        >
          <LuChevronRight aria-hidden className="size-4" />
        </button>
      </div>

      <div role="grid" ref={gridRef} onKeyDown={onKeyDown} className="flex flex-col gap-1">
        <div role="row" className="grid grid-cols-7 gap-1">
          {weekdayNames(language).map((name) => (
            <span
              key={name}
              role="columnheader"
              className="py-1 text-center text-[0.7rem] font-medium text-neutral-400 capitalize"
            >
              {name}
            </span>
          ))}
        </div>
        {/* A new month slides in from where it comes */}
        <div
          key={month}
          className={cn(
            "flex flex-col gap-1 duration-200 animate-in fade-in motion-reduce:animate-none",
            direction === "next" ? "slide-in-from-right-3" : "slide-in-from-left-3",
          )}
        >
          {weeks.map((week) => (
            <div key={week[0]} role="row" className="grid grid-cols-7 gap-1">
              {week.map((day) => {
                const isOtherMonth = !day.startsWith(month.slice(0, 7));
                const isSelected = day === value;
                const isToday = day === today;

                return (
                  <button
                    key={day}
                    type="button"
                    role="gridcell"
                    data-day={day}
                    tabIndex={day === focused ? 0 : -1}
                    aria-selected={isSelected}
                    aria-current={isToday ? "date" : undefined}
                    aria-label={formatFullDate(day, language)}
                    disabled={isDisabled(day)}
                    onClick={() => {
                      go(day, false);
                      onChange(day);
                    }}
                    className={cn(
                      "flex aspect-square items-center justify-center rounded-xl text-sm tabular-nums transition",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:pointer-events-none disabled:opacity-25",
                      isSelected
                        ? "bg-neutral-900 font-semibold text-white dark:bg-white dark:text-neutral-900"
                        : "hover:bg-neutral-100 dark:hover:bg-neutral-800",
                      !isSelected && isOtherMonth && "text-neutral-400 dark:text-neutral-600",
                      !isSelected && isToday && "font-semibold text-emerald-600 ring-1 ring-emerald-500/60 dark:text-emerald-400",
                    )}
                  >
                    {Number(day.slice(8))}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
