// SHARED-UI
"use client";

import { FC, ReactNode, useState } from "react";
import { Popover } from "radix-ui";
import { useTranslation } from "react-i18next";
import { menuSurface } from "../Field/select";
import { addDaysIso, addMonthsIso, todayIso } from "@/shared/lib/dates";
import { DateCalendar } from "./date-calendar";

interface DatePickerProps {
  value: string | null;
  onChange: (iso: string) => void;
  // Without it the picker has no way to remove the date
  onClear?: () => void;
  min?: string;
  max?: string;
  // The button that opens it
  children: ReactNode;
  align?: "start" | "center" | "end";
}

// The month grid in a floating card, with the usual distances one tap away
export const DatePicker: FC<DatePickerProps> = ({ value, onChange, onClear, min, max, children, align = "start" }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const pick = (iso: string) => {
    onChange(iso);
    setOpen(false);
  };

  const today = todayIso();
  const quickPicks = [
    { label: t("calendar.inWeek"), iso: addDaysIso(today, 7) },
    { label: t("calendar.inTwoWeeks"), iso: addDaysIso(today, 14) },
    { label: t("calendar.inMonth"), iso: addMonthsIso(today, 1) },
  ];

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align={align}
          sideOffset={8}
          collisionPadding={12}
          className={`${menuSurface} flex flex-col gap-3 p-3 outline-none`}
        >
          <DateCalendar value={value} onChange={pick} min={min} max={max} />
          <div className="flex flex-wrap gap-1.5 border-t border-neutral-100 pt-2.5 dark:border-neutral-800">
            {quickPicks.map((quick) => (
              <button
                key={quick.label}
                type="button"
                onClick={() => pick(quick.iso)}
                className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 transition hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
              >
                {quick.label}
              </button>
            ))}
            {onClear && value && (
              <button
                type="button"
                onClick={() => {
                  onClear();
                  setOpen(false);
                }}
                className="ml-auto rounded-full px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
              >
                {t("calendar.clear")}
              </button>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
