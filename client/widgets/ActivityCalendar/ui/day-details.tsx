"use client";

import { FC } from "react";
import { LuSkull } from "react-icons/lu";
import type { ICalendarDeadline } from "@/entities/statistics";
import { useTranslation } from "@/shared/i18n";
import { cn, formatFullDate } from "@/shared/lib";
import { DayStatus } from "../lib/calendar";

interface DayDetailsProps {
  day: string;
  status: DayStatus;
  deadlines: ICalendarDeadline[];
  // On the dark tooltip the status is dimmed, on the light panel it is grey
  statusClassName: string;
  iconClassName: string;
}

// One day told in words: its date, whether there was study, the deadlines that fall on it.
// The desktop tooltip and the panel a tap opens on a phone say the same
export const DayDetails: FC<DayDetailsProps> = ({ day, status, deadlines, statusClassName, iconClassName }) => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <span className="block font-medium first-letter:uppercase">{formatFullDate(day, i18n.language)}</span>
      <span className={cn("block", statusClassName)}>{t(`calendar.status.${status}`)}</span>
      {deadlines.map((item) => (
        <span key={item.materialId} className="mt-1 flex items-center gap-1.5">
          <LuSkull aria-hidden className={cn("shrink-0", iconClassName)} /> {item.title}
        </span>
      ))}
    </>
  );
};
