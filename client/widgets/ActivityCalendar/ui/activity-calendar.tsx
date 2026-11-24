"use client";

import { FC, KeyboardEvent, PointerEvent, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { LuSkull } from "react-icons/lu";
import { ICalendarDeadline, useStudyCalendar } from "@/entities/statistics";
import { useMediaQuery } from "@/shared/hooks";
import { useTranslation } from "@/shared/i18n";
import { cn, addDaysIso, daysBetweenIso, formatFullDate, formatIsoDate, todayIso, weekdayNames } from "@/shared/lib";
import { CalendarView, DayStatus, rangeOf, STATUS_STYLES, stepAnchor } from "../lib/calendar";
import { CalendarHeader } from "./calendar-header";
import { MonthView, RenderDay, WeekView, YearView } from "./calendar-views";
import { CalendarLegend } from "./calendar-legend";
import { DayDetails } from "./day-details";

// A calendar in the spirit of a contribution graph: one small square a day, green when there was
// study, orange for the running streak, a skull on a deadline. Week, month or year
const Calendar: FC = () => {
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [today] = useState(todayIso);
  const [view, setView] = useState<CalendarView>("month");
  const [anchor, setAnchor] = useState(today);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [hovered, setHovered] = useState<{ day: string; x: number; y: number } | null>(null);
  // A tap on a phone: there is no hover to tell what a square means
  const [tapped, setTapped] = useState<string | null>(null);
  const [focusDay, setFocusDay] = useState(today);
  const gridRef = useRef<HTMLDivElement>(null);

  const { from, to } = rangeOf(view, anchor);
  const { studyCalendarData: data, studyCalendarIsPending } = useStudyCalendar(from, to);

  const { studied, streak, deadlines } = useMemo(() => {
    const byDay = new Map<string, ICalendarDeadline[]>();
    data?.deadlines.forEach((item) => byDay.set(item.date, [...(byDay.get(item.date) ?? []), item]));

    return {
      studied: new Set(data?.studyDays),
      streak: new Set(data?.streakDays),
      deadlines: byDay,
    };
  }, [data]);

  const statusOf = (day: string): DayStatus => (streak.has(day) ? "streak" : studied.has(day) ? "studied" : "none");

  const move = (step: 1 | -1) => {
    setDirection(step);
    setTapped(null);
    setAnchor((prev) => stepAnchor(view, prev, step));
  };

  const goToday = () => {
    setDirection(anchor > today ? -1 : 1);
    setAnchor(today);
  };

  const openMonth = (monthDay: string) => {
    setView("month");
    setAnchor(monthDay);
  };

  const title =
    view === "week"
      ? `${formatIsoDate(from, language, { day: "numeric", month: "short" })} – ${formatIsoDate(to, language, { day: "numeric", month: "short", year: "numeric" })}`
      : view === "month"
        ? formatIsoDate(anchor, language, { month: "long", year: "numeric" })
        : anchor.slice(0, 4);

  // The edges of neighbouring months and years are on the grid but not in the count
  const period = view === "month" ? anchor.slice(0, 7) : view === "year" ? anchor.slice(0, 4) : "";
  const studiedCount = daysBetweenIso(from, to).filter((day) => day.startsWith(period) && studied.has(day)).length;

  const showTooltip = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    setHovered({ day: element.dataset.day!, x: rect.left + rect.width / 2, y: rect.top });
  };

  const onPointerOver = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const square = (event.target as HTMLElement).closest<HTMLElement>("[data-day]");
    if (square) showTooltip(square);
    else setHovered(null);
  };

  // Arrows walk the squares like any grid; only one of them is in the tab order
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const steps: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    const step = steps[event.key];
    if (!step) return;

    const next = addDaysIso(focusDay, step);
    const target = gridRef.current?.querySelector<HTMLElement>(`[data-day="${next}"]`);
    if (!target) return;

    event.preventDefault();
    setFocusDay(next);
    target.focus();
  };

  const renderDay: RenderDay = (day, className, showDate) => {
    const status = statusOf(day);
    const hasDeadline = deadlines.has(day);
    const isFuture = day > today;

    return (
      <button
        key={day}
        type="button"
        role="gridcell"
        data-day={day}
        tabIndex={day === focusDay ? 0 : -1}
        aria-label={`${formatFullDate(day, language)}. ${t(`calendar.status.${status}`)}${hasDeadline ? `. ${t("calendar.legend.deadline")}` : ""}`}
        aria-current={day === today ? "date" : undefined}
        onFocus={(event) => showTooltip(event.currentTarget)}
        onBlur={() => setHovered(null)}
        onClick={() => setTapped(day)}
        className={cn(
          "relative flex items-center justify-center rounded-[22%] transition-[background-color,transform] duration-300",
          "hover:scale-110 focus-visible:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 motion-reduce:transition-none",
          STATUS_STYLES[status],
          // A deadline is always ahead, and it is the one future day that has to stand out
          isFuture && !hasDeadline && "opacity-50",
          day === today && "ring-2 ring-neutral-900 ring-offset-1 ring-offset-white dark:ring-white dark:ring-offset-neutral-900",
          className,
        )}
      >
        {/* Room for one thing in a small square: the skull matters more than the number */}
        {hasDeadline ? (
          <LuSkull aria-hidden className="size-[70%]" />
        ) : (
          showDate && <span className="font-medium tabular-nums">{Number(day.slice(8))}</span>
        )}
      </button>
    );
  };

  const viewProps = { renderDay, weekdays: weekdayNames(language, isDesktop ? "short" : "narrow"), isDesktop, language };

  return (
    <section className="flex w-full max-w-5xl flex-col gap-5 rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
      <CalendarHeader title={title} view={view} onViewChange={setView} onMove={move} onToday={goToday} />

      <div
        ref={gridRef}
        role="grid"
        aria-label={title}
        aria-busy={studyCalendarIsPending}
        onPointerOver={onPointerOver}
        onPointerLeave={() => setHovered(null)}
        onKeyDown={onKeyDown}
      >
        <motion.div
          key={`${view}:${from}`}
          initial={{ opacity: 0, x: 18 * direction }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {view === "week" ? (
            <WeekView from={from} to={to} {...viewProps} />
          ) : view === "month" ? (
            <MonthView anchor={anchor} {...viewProps} />
          ) : (
            <YearView anchor={anchor} from={from} to={to} onOpenMonth={openMonth} {...viewProps} />
          )}
        </motion.div>
      </div>

      {/* Phones have no hover: a tap tells the same as the tooltip does on a desktop */}
      {!isDesktop && tapped && (
        <p className="rounded-2xl bg-neutral-100 p-3 text-sm dark:bg-neutral-800">
          <DayDetails
            day={tapped}
            status={statusOf(tapped)}
            deadlines={deadlines.get(tapped) ?? []}
            statusClassName="text-neutral-500"
            iconClassName="size-3.5"
          />
        </p>
      )}

      <CalendarLegend studiedCount={studiedCount} />

      {/* One tooltip for all the squares, gliding between them: hundreds of separate ones would be slow */}
      {hovered && (
        <div
          role="tooltip"
          style={{ left: `clamp(7rem, ${hovered.x}px, calc(100vw - 7rem))`, top: hovered.y - 8 }}
          className="pointer-events-none fixed z-50 w-max max-w-56 -translate-x-1/2 -translate-y-full rounded-xl bg-neutral-900 px-3 py-2 text-xs text-white shadow-lg transition-[left,top] duration-100 motion-reduce:transition-none dark:bg-neutral-100 dark:text-neutral-900"
        >
          <DayDetails
            day={hovered.day}
            status={statusOf(hovered.day)}
            deadlines={deadlines.get(hovered.day) ?? []}
            statusClassName="opacity-70"
            iconClassName="size-3"
          />
        </div>
      )}
    </section>
  );
};

const subscribeToNothing = () => () => {};

// "Today" is the browser's: rendered on the server it could be another date and break hydration,
// so the calendar itself appears only in the browser
export const ActivityCalendar: FC = () => {
  const isBrowser = useSyncExternalStore(subscribeToNothing, () => true, () => false);

  return isBrowser ? (
    <Calendar />
  ) : (
    <div aria-busy="true" className="h-96 w-full max-w-5xl animate-pulse rounded-3xl bg-neutral-100 dark:bg-neutral-900" />
  );
};
