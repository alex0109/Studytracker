"use client";

import { FC } from "react";
import { LuSkull } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { STATUS_STYLES } from "../lib/calendar";

// What the colours mean, and how many days of the period had study
export const CalendarLegend: FC<{ studiedCount: number }> = ({ studiedCount }) => {
  const { t } = useTranslation();

  return (
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
  );
};
