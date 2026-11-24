"use client";

import { FC } from "react";
import { LuBell, LuChartColumn, LuFlame } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";
import { DemoPanel } from "./demo-card";

const ITEMS = [
  { key: "review", icon: LuBell, tone: "text-emerald-600" },
  { key: "streak", icon: LuFlame, tone: "text-orange-500" },
  { key: "weekly", icon: LuChartColumn, tone: "text-violet-600" },
] as const;

// Gentle nudges by email and in the app: what is due, a streak at risk, last week in numbers
export const RemindersDemo: FC = () => {
  const { t } = useTranslation();

  return (
    <DemoPanel className="flex flex-col gap-2">
      {ITEMS.map((item) => (
        <div key={item.key} className="flex items-start gap-2.5 rounded-xl bg-neutral-50 p-2.5 dark:bg-neutral-900">
          <item.icon aria-hidden className={`mt-0.5 shrink-0 ${item.tone}`} />
          <span className="text-sm text-neutral-700 dark:text-neutral-300">{t(`landing.features.demo.reminders.${item.key}`)}</span>
        </div>
      ))}
    </DemoPanel>
  );
};
