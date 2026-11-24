"use client";

import { FC } from "react";
import { LuCoins, LuSparkles, LuSprout, LuUsers } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";
import { DemoPanel } from "./demo-card";

const PLANS = [
  { key: "free", icon: LuSprout, tone: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200" },
  { key: "plus", icon: LuSparkles, tone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  { key: "duo", icon: LuUsers, tone: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300" },
  { key: "credits", icon: LuCoins, tone: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
] as const;

// Free for good, more AI on Plus, Plus for two on Duo, and credits when a quota runs out
export const PlansDemo: FC = () => {
  const { t } = useTranslation();

  return (
    <DemoPanel className="grid grid-cols-2 gap-2">
      {PLANS.map((plan) => (
        <div key={plan.key} className="flex flex-col gap-1 rounded-xl border border-neutral-100 p-3 dark:border-neutral-800">
          <span className={`flex size-7 items-center justify-center rounded-lg ${plan.tone}`}>
            <plan.icon aria-hidden />
          </span>
          <span className="text-sm font-semibold">{t(`landing.features.demo.plans.${plan.key}.title`)}</span>
          <span className="text-xs text-neutral-500">{t(`landing.features.demo.plans.${plan.key}.text`)}</span>
        </div>
      ))}
    </DemoPanel>
  );
};
