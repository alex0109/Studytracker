"use client";

import { FC } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { IconType } from "react-icons";
import { LuCircleHelp, LuListChecks, LuMessageCircleQuestion, LuScrollText, LuSparkles } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";
import { DemoPanel } from "./demo-card";

const ROWS: { key: "questions" | "grading" | "explain" | "summary"; icon: IconType }[] = [
  { key: "questions", icon: LuCircleHelp },
  { key: "grading", icon: LuListChecks },
  { key: "explain", icon: LuMessageCircleQuestion },
  { key: "summary", icon: LuScrollText },
];

// What AI does for you, lighting up one after another
export const AiDemo: FC = () => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  return (
    <DemoPanel className="flex flex-col gap-2">
      {ROWS.map((row, index) => (
        <motion.div
          key={row.key}
          initial={reduceMotion ? false : { opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.35, delay: index * 0.12 }}
          className="flex items-center gap-3 rounded-xl px-2 py-1.5 text-sm"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
            <row.icon aria-hidden />
          </span>
          <span className="flex-1 text-neutral-700 dark:text-neutral-300">{t(`landing.features.demo.ai.${row.key}`)}</span>
          <motion.span
            initial={reduceMotion ? false : { scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.25 + index * 0.12 }}
            className="text-violet-500"
          >
            <LuSparkles aria-hidden />
          </motion.span>
        </motion.div>
      ))}
    </DemoPanel>
  );
};
