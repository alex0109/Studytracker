"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { CalendarView, VIEWS } from "../lib/calendar";

const ARROW =
  "flex size-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800";

interface CalendarHeaderProps {
  title: string;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onMove: (step: 1 | -1) => void;
  onToday: () => void;
}

// Back, forward and today on one side; week, month or year on the other
export const CalendarHeader: FC<CalendarHeaderProps> = ({ title, view, onViewChange, onMove, onToday }) => {
  const { t } = useTranslation();

  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <button type="button" aria-label={t("calendar.previous")} onClick={() => onMove(-1)} className={ARROW}>
          <LuChevronLeft aria-hidden className="size-4" />
        </button>
        <button type="button" aria-label={t("calendar.next")} onClick={() => onMove(1)} className={ARROW}>
          <LuChevronRight aria-hidden className="size-4" />
        </button>
        <h2 aria-live="polite" className="ml-1 text-lg! font-semibold! capitalize">
          {title}
        </h2>
        <button
          type="button"
          onClick={onToday}
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
            onClick={() => onViewChange(item)}
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
  );
};
