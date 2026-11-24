"use client";

import { FC, useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import { cn } from "@/shared/lib";

export type LimitsTab = "usage" | "plans" | "credits" | "duo";

const TABS: readonly LimitsTab[] = ["usage", "plans", "credits", "duo"];
const isTab = (value: string): value is LimitsTab => (TABS as readonly string[]).includes(value);

// The open tab lives in the address (#plans, #credits), so links from elsewhere — the upsell window,
// "see plans" — open the right one, and a reload keeps it
export const useLimitsTab = (available: LimitsTab[]) => {
  const [tab, setTab] = useState<LimitsTab>("usage");
  // A new array each render would re-run the effect: its contents are what matters
  const key = available.join(",");

  useEffect(() => {
    const allowed = key.split(",");
    const fromHash = () => {
      const hash = window.location.hash.slice(1);
      if (isTab(hash) && allowed.includes(hash)) setTab(hash);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [key]);

  const open = useCallback((next: LimitsTab) => {
    setTab(next);
    window.history.replaceState(null, "", next === "usage" ? window.location.pathname : `#${next}`);
  }, []);

  return { tab: available.includes(tab) ? tab : "usage", open };
};

interface LimitsTabsProps {
  tabs: { value: LimitsTab; label: string; icon: IconType }[];
  value: LimitsTab;
  onChange: (tab: LimitsTab) => void;
}

// One row of tabs; on a phone they share the width
export const LimitsTabs: FC<LimitsTabsProps> = ({ tabs, value, onChange }) => (
  <div
    role="tablist"
    className="flex w-full gap-1 overflow-x-auto rounded-2xl border border-neutral-200 bg-white p-1 dark:border-neutral-800 dark:bg-neutral-900"
  >
    {tabs.map(({ value: tab, label, icon: Icon }) => (
      <button
        key={tab}
        id={`limits-tab-${tab}`}
        type="button"
        role="tab"
        aria-selected={value === tab}
        aria-controls={`limits-panel-${tab}`}
        onClick={() => onChange(tab)}
        className={cn(
          "relative flex flex-1 shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors max-sm:min-h-12",
          value === tab ? "text-white dark:text-neutral-900" : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800",
        )}
      >
        {value === tab && (
          <motion.span
            layoutId="limits-tab"
            className="absolute inset-0 rounded-xl bg-neutral-900 dark:bg-white"
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          />
        )}
        <Icon aria-hidden className="relative" />
        <span className="relative">{label}</span>
      </button>
    ))}
  </div>
);
