"use client";

import { FC } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LuGraduationCap } from "react-icons/lu";
import { cn } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";
import { DemoPanel } from "./demo-card";

const DAYS = 28;
const TODAY = 9;
const EXAM = 14;
// Days the material was studied before today
const STUDIED = new Set([2, 3, 5, 6, 7, 8]);

// A deadline on a material, counted down in the calendar
export const DeadlineDemo: FC = () => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  return (
    <DemoPanel className="flex flex-col gap-3">
      <div className="grid grid-cols-7 gap-1" aria-hidden>
        {Array.from({ length: DAYS }, (_, index) => {
          const day = index + 1;
          const isExam = day === EXAM;
          const isToday = day === TODAY;

          return (
            <motion.span
              key={day}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.015 }}
              className={cn(
                "relative flex aspect-square items-center justify-center rounded-md text-[11px] tabular-nums",
                isExam
                  ? "bg-rose-500 font-semibold text-white"
                  : isToday
                    ? "bg-neutral-900 font-semibold text-white dark:bg-neutral-100 dark:text-neutral-900"
                    : day > TODAY && day < EXAM
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                      : "text-neutral-500",
              )}
            >
              {day}
              {STUDIED.has(day) && <span className="absolute bottom-0.5 size-1 rounded-full bg-emerald-500" />}
              {isExam && !reduceMotion && (
                <motion.span
                  className="absolute inset-0 rounded-md ring-2 ring-rose-400"
                  animate={{ scale: [1, 1.25], opacity: [0.8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "easeOut" }}
                />
              )}
            </motion.span>
          );
        })}
      </div>
      <p className="flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
        <LuGraduationCap aria-hidden className="shrink-0" />
        {t("landing.features.demo.deadlines.exam", { count: EXAM - TODAY })}
      </p>
    </DemoPanel>
  );
};
