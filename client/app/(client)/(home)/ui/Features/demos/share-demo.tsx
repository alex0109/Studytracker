"use client";

import { FC, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuCheck, LuCopy, LuLink, LuX } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";
import { DemoPanel } from "./demo-card";

const COPIED: ("notes" | "dictionaries" | "questions")[] = ["notes", "dictionaries", "questions"];

// A link gives a friend their own copy; your attempts and progress stay yours
export const ShareDemo: FC = () => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  return (
    <DemoPanel className="flex flex-col gap-3">
      <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 py-1.5 pl-3 pr-1.5 dark:border-neutral-800 dark:bg-neutral-900">
        <LuLink aria-hidden className="shrink-0 text-neutral-400" />
        <span className="min-w-0 flex-1 truncate font-mono text-xs text-neutral-600 dark:text-neutral-400">studytracker.app/share/7f3k…</span>
        <button
          type="button"
          onClick={() => setCopied(true)}
          className="inline-flex h-7 shrink-0 items-center gap-1 rounded-lg bg-neutral-900 px-2.5 text-xs font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={copied ? "copied" : "copy"}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="inline-flex items-center gap-1"
            >
              {copied ? <LuCheck aria-hidden /> : <LuCopy aria-hidden />}
              {copied ? t("landing.features.demo.share.copied") : t("landing.features.demo.share.copy")}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
      <ul className="grid grid-cols-2 gap-1.5 text-xs">
        {COPIED.map((key) => (
          <li key={key} className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
            <LuCheck aria-hidden className="text-emerald-500" /> {t(`landing.features.demo.share.${key}`)}
          </li>
        ))}
        <li className="flex items-center gap-1.5 text-neutral-500">
          <LuX aria-hidden className="text-neutral-400" /> {t("landing.features.demo.share.attempts")}
        </li>
      </ul>
    </DemoPanel>
  );
};
