"use client";

import { FC, KeyboardEvent, PointerEvent, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { LuChevronLeft, LuChevronRight, LuSkull } from "react-icons/lu";
import { useStudyCalendar } from "@/entities/statistics";
import type { ICalendarDeadline } from "@/entities/statistics/model/study-calendar";
import { useMediaQuery } from "@/shared/hooks/use-media-query";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";
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

type CalendarView = "week" | "month" | "year";
type DayStatus = "none" | "studied" | "streak";

const VIEWS: CalendarView[] = ["week", "month", "year"];

const STATUS_STYLES: Record<DayStatus, string> = {
  none: "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
  studied: "bg-emerald-500 text-white",
  streak: "bg-orange-500 text-white",
};

// Fixed tracks: a long weekday name in any language can't push the squares out of line under it.
// A little larger on phones, where the date is written inside and a finger has to hit it
const MONTH_COLUMNS = "grid-cols-[repeat(7,2rem)] gap-1.5 md:grid-cols-[repeat(7,1.75rem)]";

const rangeOf = (view: CalendarView, anchor: string) => {
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

const daysBetween = (from: string, to: string) => {
  const days: string[] = [];
  for (let day = from; day <= to; day = addDaysIso(day, 1)) days.push(day);
  return days;
};

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
    setAnchor((prev) =>
      view === "week" ? addDaysIso(prev, 7 * step) : view === "month" ? addMonthsIso(prev, step) : addMonthsIso(prev, 12 * step),
    );
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
  const studiedCount = daysBetween(from, to).filter((day) => day.startsWith(period) && studied.has(day)).length;

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

  const square = (day: string, className: string, showDate: boolean) => {
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

  const weekdays = weekdayNames(language, isDesktop ? "short" : "narrow");

  const weekView = (
    <div className="mx-auto grid w-full max-w-md grid-cols-7 gap-2">
      {daysBetween(from, to).map((day, index) => (
        <div key={day} className="flex flex-col items-center gap-1.5">
          <span className="text-xs text-neutral-500 capitalize">{weekdays[index]}</span>
          {square(day, "size-8 text-xs", !isDesktop)}
          <span className="hidden text-xs text-neutral-500 tabular-nums md:block">
            {formatIsoDate(day, language, { day: "numeric", month: "short" })}
          </span>
        </div>
      ))}
    </div>
  );

  const monthGrid = (month: string, compact: boolean) => (
    <div className={cn("grid", compact ? "max-w-32 grid-cols-7 gap-[3px]" : MONTH_COLUMNS)}>
      {monthGridIso(month).map((day) =>
        day.slice(0, 7) === month.slice(0, 7) ? (
          square(day, cn("aspect-square w-full", compact ? "text-[0.6rem]" : "text-xs"), !isDesktop)
        ) : (
          <span key={day} aria-hidden />
        ),
      )}
    </div>
  );

  const monthView = (
    <div className="mx-auto flex w-max flex-col gap-2">
      <div className={cn("grid", MONTH_COLUMNS)}>
        {weekdays.map((name, index) => (
          <span key={index} className="text-center text-[0.7rem] whitespace-nowrap text-neutral-500 capitalize">
            {name}
          </span>
        ))}
      </div>
      {monthGrid(startOfMonthIso(anchor), false)}
    </div>
  );

  // The long strip of weeks reads on a wide screen; a phone gets months it can write dates in
  const months = Array.from({ length: 12 }, (_, index) => `${anchor.slice(0, 4)}-${String(index + 1).padStart(2, "0")}-01`);
  const yearDays = daysBetween(from, to);

  const yearView = isDesktop ? (
    <div className="overflow-x-auto pb-1">
      <div className="mx-auto w-max">
        <div className="relative mb-1.5 ml-8 h-4 text-xs text-neutral-500">
          {months.map((month) => {
            const column = Math.floor(yearDays.indexOf(month) / 7);
            return (
              <button
                key={month}
                type="button"
                onClick={() => openMonth(month)}
                style={{ left: `calc(${column} * (var(--square) + 3px))`, ["--square" as string]: "0.75rem" }}
                className="absolute capitalize transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                {formatIsoDate(month, language, { month: "short" })}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2">
          <div aria-hidden className="grid w-6 grid-rows-7 gap-[3px] text-[0.65rem] leading-3 text-neutral-500">
            {weekdays.map((name, index) => (
              <span key={index} className={cn("capitalize", index % 2 === 1 && "invisible")}>
                {name}
              </span>
            ))}
          </div>
          <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
            {yearDays.map((day) =>
              day.startsWith(anchor.slice(0, 4)) ? square(day, "size-3", false) : <span key={day} aria-hidden className="size-3" />,
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="grid grid-cols-2 gap-x-4 gap-y-5">
      {months.map((month) => (
        <div key={month} className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => openMonth(month)}
            className="self-start text-xs font-semibold text-neutral-600 capitalize dark:text-neutral-300"
          >
            {formatIsoDate(month, language, { month: "long" })}
          </button>
          {monthGrid(month, true)}
        </div>
      ))}
    </div>
  );

  const hoveredDeadlines = hovered ? (deadlines.get(hovered.day) ?? []) : [];
  const tappedDeadlines = tapped ? (deadlines.get(tapped) ?? []) : [];
  const arrow =
    "flex size-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800";

  return (
    <section className="flex w-full max-w-5xl flex-col gap-5 rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button type="button" aria-label={t("calendar.previous")} onClick={() => move(-1)} className={arrow}>
            <LuChevronLeft aria-hidden className="size-4" />
          </button>
          <button type="button" aria-label={t("calendar.next")} onClick={() => move(1)} className={arrow}>
            <LuChevronRight aria-hidden className="size-4" />
          </button>
          <h2 aria-live="polite" className="ml-1 text-lg! font-semibold! capitalize">
            {title}
          </h2>
          <button
            type="button"
            onClick={goToday}
            className="ml-1 rounded-full px-3 py-1.5 text-xs font-medium text-neutral-600 transition hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            {t("calendar.today")}
          </button>
        </div>

        <div role="group" aria-label={t("calendar.viewLabel")} className="flex rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800">
          {VIEWS.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={view === item}
              onClick={() => setView(item)}
              className={cn(
                "relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                view === item ? "text-neutral-900 dark:text-white" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100",
              )}
            >
              {view === item && (
                <motion.span
                  layoutId="calendar-view"
                  className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-neutral-600"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative">{t(`calendar.view.${item}`)}</span>
            </button>
          ))}
        </div>
      </header>

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
          {view === "week" ? weekView : view === "month" ? monthView : yearView}
        </motion.div>
      </div>

      {/* Phones have no hover: a tap tells the same as the tooltip does on a desktop */}
      {!isDesktop && tapped && (
        <p className="rounded-2xl bg-neutral-100 p-3 text-sm dark:bg-neutral-800">
          <span className="font-medium first-letter:uppercase">{formatFullDate(tapped, language)}</span>
          <span className="block text-neutral-500">{t(`calendar.status.${statusOf(tapped)}`)}</span>
          {tappedDeadlines.map((item) => (
            <span key={item.materialId} className="mt-1 flex items-center gap-1.5">
              <LuSkull aria-hidden className="size-3.5 shrink-0" /> {item.title}
            </span>
          ))}
        </p>
      )}

      <footer className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-neutral-100 pt-4 text-xs text-neutral-600 dark:border-neutral-800 dark:text-neutral-300">
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {(["none", "studied", "streak"] as const).map((status) => (
            <li key={status} className="flex items-center gap-1.5">
              <span aria-hidden className={cn("size-3.5 rounded-[22%]", STATUS_STYLES[status])} />
              {t(`calendar.legend.${status}`)}
            </li>
          ))}
          <li className="flex items-center gap-1.5">
            <span aria-hidden className={cn("flex size-3.5 items-center justify-center rounded-[22%]", STATUS_STYLES.none)}>
              <LuSkull className="size-2.5" />
            </span>
            {t("calendar.legend.deadline")}
          </li>
        </ul>
        <span className="tabular-nums text-neutral-500">{t("calendar.daysStudied", { count: studiedCount })}</span>
      </footer>

      {/* One tooltip for all the squares, gliding between them: hundreds of separate ones would be slow */}
      {hovered && (
        <div
          role="tooltip"
          style={{
            left: `clamp(7rem, ${hovered.x}px, calc(100vw - 7rem))`,
            top: hovered.y - 8,
          }}
          className="pointer-events-none fixed z-50 w-max max-w-56 -translate-x-1/2 -translate-y-full rounded-xl bg-neutral-900 px-3 py-2 text-xs text-white shadow-lg transition-[left,top] duration-100 motion-reduce:transition-none dark:bg-neutral-100 dark:text-neutral-900"
        >
          <span className="block font-medium first-letter:uppercase">{formatFullDate(hovered.day, language)}</span>
          <span className="block opacity-70">{t(`calendar.status.${statusOf(hovered.day)}`)}</span>
          {hoveredDeadlines.map((item) => (
            <span key={item.materialId} className="mt-1 flex items-center gap-1.5">
              <LuSkull aria-hidden className="size-3 shrink-0" /> {item.title}
            </span>
          ))}
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
