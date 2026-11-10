"use client";

import { FC, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { LuCheck, LuPlus } from "react-icons/lu";
import { cn } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";
import { DemoPanel } from "./demo-card";

// Selecting a word in any text: translation, grammar and one click to the dictionary
export const LookupDemo: FC = () => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const [added, setAdded] = useState(false);

  return (
    <div ref={ref}>
      <DemoPanel className="flex flex-col gap-3">
        <p lang="de" className="text-sm text-neutral-700 dark:text-neutral-300">
          Ich habe einen{" "}
          <span className="relative inline-block">
            <motion.span
              aria-hidden
              className="absolute -inset-x-0.5 inset-y-0 origin-left rounded-sm bg-sky-200/80 dark:bg-sky-800/60"
              initial={{ scaleX: reduceMotion ? 1 : 0 }}
              animate={isInView ? { scaleX: 1 } : undefined}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
            <span className="relative font-medium">Hund</span>
          </span>{" "}
          und zwei Katzen.
        </p>
        <AnimatePresence>
          {isInView && (
            <motion.div
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, delay: reduceMotion ? 0 : 0.8 }}
              className="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span lang="de" className="font-semibold">
                  <span className="text-neutral-400">der</span> Hund
                </span>
                <span className="text-xs text-neutral-500">[hʊnt]</span>
              </div>
              <span className="text-sm text-neutral-700 dark:text-neutral-300">{t("landing.features.demo.lookup.translation")}</span>
              <button
                type="button"
                onClick={() => setAdded(true)}
                className={cn(
                  "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg text-xs font-medium transition",
                  added
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                    : "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900",
                )}
              >
                {added ? <LuCheck aria-hidden /> : <LuPlus aria-hidden />}
                {added ? t("landing.features.demo.lookup.added") : t("landing.features.demo.lookup.add")}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </DemoPanel>
    </div>
  );
};
