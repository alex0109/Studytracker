"use client";

import { FC, ReactNode } from "react";
import { cn, daysBetweenIso, formatIsoDate, monthGridIso, startOfMonthIso } from "@/shared/lib";

// A square of one day; the calendar knows what it looks like
export type RenderDay = (day: string, className: string, showDate: boolean) => ReactNode;

// Fixed tracks: a long weekday name in any language can't push the squares out of line under it.
// A little larger on phones, where the date is written inside and a finger has to hit it
const MONTH_COLUMNS = "grid-cols-[repeat(7,2rem)] gap-1.5 md:grid-cols-[repeat(7,1.75rem)]";

interface ViewProps {
  renderDay: RenderDay;
  weekdays: string[];
  isDesktop: boolean;
  language: string;
}

export const WeekView: FC<ViewProps & { from: string; to: string }> = ({ from, to, renderDay, weekdays, isDesktop, language }) => (
  <div className="mx-auto grid w-full max-w-md grid-cols-7 gap-2">
    {daysBetweenIso(from, to).map((day, index) => (
      <div key={day} className="flex flex-col items-center gap-1.5">
        <span className="text-xs text-neutral-500 capitalize">{weekdays[index]}</span>
        {renderDay(day, "size-8 text-xs", !isDesktop)}
        <span className="hidden text-xs text-neutral-500 tabular-nums md:block">
          {formatIsoDate(day, language, { day: "numeric", month: "short" })}
        </span>
      </div>
    ))}
  </div>
);

// One month's squares; the days of the months around it are left empty
const MonthGrid: FC<{ month: string; compact: boolean; renderDay: RenderDay; isDesktop: boolean }> = ({ month, compact, renderDay, isDesktop }) => (
  <div className={cn("grid", compact ? "max-w-32 grid-cols-7 gap-[3px]" : MONTH_COLUMNS)}>
    {monthGridIso(month).map((day) =>
      day.slice(0, 7) === month.slice(0, 7) ? (
        renderDay(day, cn("aspect-square w-full", compact ? "text-[0.6rem]" : "text-xs"), !isDesktop)
      ) : (
        <span key={day} aria-hidden />
      ),
    )}
  </div>
);

export const MonthView: FC<ViewProps & { anchor: string }> = ({ anchor, renderDay, weekdays, isDesktop }) => (
  <div className="mx-auto flex w-max flex-col gap-2">
    <div className={cn("grid", MONTH_COLUMNS)}>
      {weekdays.map((name, index) => (
        <span key={index} className="text-center text-[0.7rem] whitespace-nowrap text-neutral-500 capitalize">
          {name}
        </span>
      ))}
    </div>
    <MonthGrid month={startOfMonthIso(anchor)} compact={false} renderDay={renderDay} isDesktop={isDesktop} />
  </div>
);

// The long strip of weeks reads on a wide screen; a phone gets months it can write dates in
export const YearView: FC<ViewProps & { anchor: string; from: string; to: string; onOpenMonth: (month: string) => void }> = ({
  anchor,
  from,
  to,
  onOpenMonth,
  renderDay,
  weekdays,
  isDesktop,
  language,
}) => {
  const year = anchor.slice(0, 4);
  const months = Array.from({ length: 12 }, (_, index) => `${year}-${String(index + 1).padStart(2, "0")}-01`);

  if (!isDesktop) {
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-5">
        {months.map((month) => (
          <div key={month} className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => onOpenMonth(month)}
              className="self-start text-xs font-semibold text-neutral-600 capitalize dark:text-neutral-300"
            >
              {formatIsoDate(month, language, { month: "long" })}
            </button>
            <MonthGrid month={month} compact renderDay={renderDay} isDesktop={isDesktop} />
          </div>
        ))}
      </div>
    );
  }

  const days = daysBetweenIso(from, to);

  return (
    <div className="overflow-x-auto pb-1">
      <div className="mx-auto w-max">
        <div className="relative mb-1.5 ml-8 h-4 text-xs text-neutral-500">
          {months.map((month) => (
            <button
              key={month}
              type="button"
              onClick={() => onOpenMonth(month)}
              style={{ left: `calc(${Math.floor(days.indexOf(month) / 7)} * (var(--square) + 3px))`, ["--square" as string]: "0.75rem" }}
              className="absolute capitalize transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              {formatIsoDate(month, language, { month: "short" })}
            </button>
          ))}
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
            {days.map((day) => (day.startsWith(year) ? renderDay(day, "size-3", false) : <span key={day} aria-hidden className="size-3" />))}
          </div>
        </div>
      </div>
    </div>
  );
};
