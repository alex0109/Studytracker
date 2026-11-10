"use client";

import { FC, useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { LuCheck, LuGlobe, LuLoaderCircle } from "react-icons/lu";
import { cn } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";
import { DemoPanel } from "./demo-card";

const STEPS = ["fetch", "extract", "questions"] as const;

// A link to an article becomes a material with its text and, if asked, questions
export const ImportDemo: FC = () => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const [done, setDone] = useState(0);

  useEffect(() => {
    if (!isInView || done >= STEPS.length) return;
    const next = setTimeout(() => setDone((value) => value + 1), reduceMotion ? 0 : 700);
    return () => clearTimeout(next);
  }, [isInView, done, reduceMotion]);

  return (
    <div ref={ref}>
      <DemoPanel className="flex flex-col gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-900">
          <LuGlobe aria-hidden className="shrink-0 text-neutral-400" />
          <span className="truncate font-mono text-xs text-neutral-600 dark:text-neutral-400">en.wikipedia.org/wiki/Photosynthesis</span>
        </div>
        <ol className="flex flex-col gap-1.5">
          {STEPS.map((step, index) => {
            const state = index < done ? "done" : index === done ? "active" : "waiting";

            return (
              <li key={step} className={cn("flex items-center gap-2 text-sm", state === "waiting" && "text-neutral-400")}>
                <span
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full text-[11px]",
                    state === "done" ? "bg-emerald-500 text-white" : "bg-neutral-100 dark:bg-neutral-800",
                  )}
                >
                  {state === "done" ? (
                    <LuCheck aria-hidden />
                  ) : state === "active" && isInView ? (
                    <motion.span
                      className="inline-flex"
                      animate={reduceMotion ? undefined : { rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
                    >
                      <LuLoaderCircle aria-hidden />
                    </motion.span>
                  ) : (
                    index + 1
                  )}
                </span>
                {t(`landing.features.demo.import.${step}`)}
              </li>
            );
          })}
        </ol>
      </DemoPanel>
    </div>
  );
};
