"use client";

import { FC, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { LuBookA, LuCircleHelp, LuFlame } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";
import { DemoPanel } from "./demo-card";

const QUESTIONS = 6;
const WORDS = 14;
const DONE = 13;

// One queue a day from every dictionary and material
export const TodayDemo: FC = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const total = QUESTIONS + WORDS;

  return (
    <div ref={ref}>
      <DemoPanel className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold">{t("today.title")}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-600 dark:bg-orange-950/50 dark:text-orange-400">
            <LuFlame aria-hidden /> {t("landing.preview.streak")}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="flex items-center gap-2 rounded-xl bg-sky-50 px-3 py-2 text-sky-800 dark:bg-sky-950/40 dark:text-sky-300">
            <LuCircleHelp aria-hidden /> {t("today.questions", { count: QUESTIONS })}
          </span>
          <span className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
            <LuBookA aria-hidden /> {t("today.words", { count: WORDS })}
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
            <motion.div
              className="h-full rounded-full bg-linear-to-r from-emerald-500 via-sky-500 to-violet-500"
              initial={{ width: reduceMotion ? `${(DONE / total) * 100}%` : 0 }}
              animate={isInView ? { width: `${(DONE / total) * 100}%` } : undefined}
              transition={{ duration: 1.4, ease: "easeOut" }}
            />
          </div>
          <span className="text-xs text-neutral-500">
            {t("landing.features.demo.today.progress", { done: DONE, total })} · {t("today.minutes", { count: 8 })}
          </span>
        </div>
      </DemoPanel>
    </div>
  );
};
