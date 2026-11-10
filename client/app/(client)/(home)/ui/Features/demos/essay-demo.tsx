"use client";

import { FC, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { LuArrowRight, LuRotateCcw, LuSparkles, LuTarget } from "react-icons/lu";
import { cn } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";
import { DemoPanel } from "./demo-card";

// A sample essay in English, the language students most often practise writing in
const ESSAY_START = "In my opinion, cities offer far more than the countryside. Many ";
const MISTAKE_ONE = "peoples thinks";
const ESSAY_MIDDLE = " that life there is stressful, but the ";
const MISTAKE_TWO = "oportunities";
const ESSAY_END = " for work and study outweigh it…";

const CRITERIA = [
  { key: "TaskResponse", score: 80 },
  { key: "Coherence", score: 84 },
  { key: "Vocabulary", score: 72 },
  { key: "Grammar", score: 76 },
] as const;
const OVERALL = Math.round(CRITERIA.reduce((sum, item) => sum + item.score, 0) / CRITERIA.length);

type Phase = "idle" | "checking" | "done";

// Plays by itself once seen; the button runs it again
export const EssayDemo: FC<{ autoPlay?: boolean }> = ({ autoPlay = true }) => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const [phase, setPhase] = useState<Phase>("idle");
  const [run, setRun] = useState(0);

  const check = () => {
    setPhase("checking");
    setRun((value) => value + 1);
  };

  useEffect(() => {
    if (!autoPlay || !isInView || run > 0) return;
    const start = setTimeout(() => {
      setPhase("checking");
      setRun((value) => value + 1);
    }, reduceMotion ? 0 : 500);
    return () => clearTimeout(start);
  }, [autoPlay, isInView, run, reduceMotion]);

  useEffect(() => {
    if (phase !== "checking") return;
    const done = setTimeout(() => setPhase("done"), reduceMotion ? 0 : 1300);
    return () => clearTimeout(done);
  }, [phase, reduceMotion]);

  const marked = phase === "done";

  return (
    <div ref={ref} className="flex flex-col gap-3">
      <DemoPanel className="flex flex-col gap-3">
        <p className="flex items-start gap-2 rounded-xl bg-violet-50 p-2.5 text-xs text-violet-800 dark:bg-violet-950/40 dark:text-violet-300">
          <LuTarget className="mt-0.5 shrink-0" aria-hidden />
          <span>
            <span className="font-semibold">{t("notes.essay.taskLabel")}:</span> {t("landing.features.demo.essay.task")}
          </span>
        </p>
        <p lang="en" className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          {ESSAY_START}
          <span className={cn("rounded-sm transition-colors duration-500", marked && "bg-rose-100 underline decoration-rose-400 decoration-wavy underline-offset-4 dark:bg-rose-950/60")}>
            {MISTAKE_ONE}
          </span>
          {ESSAY_MIDDLE}
          <span className={cn("rounded-sm transition-colors duration-500", marked && "bg-rose-100 underline decoration-rose-400 decoration-wavy underline-offset-4 dark:bg-rose-950/60")}>
            {MISTAKE_TWO}
          </span>
          {ESSAY_END}
        </p>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-neutral-500">{t("notes.essay.words", { count: 274 })}</span>
          <button
            type="button"
            onClick={check}
            disabled={phase === "checking"}
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-violet-700 px-3.5 text-sm font-medium text-white transition hover:bg-violet-800 disabled:opacity-70"
          >
            {phase === "checking" ? (
              <motion.span animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="inline-flex">
                <LuSparkles aria-hidden />
              </motion.span>
            ) : phase === "done" ? (
              <LuRotateCcw aria-hidden />
            ) : (
              <LuSparkles aria-hidden />
            )}
            {phase === "checking" ? t("notes.essay.checking") : phase === "done" ? t("notes.essay.checkAgain") : t("notes.essay.check")}
          </button>
        </div>
      </DemoPanel>

      <AnimatePresence mode="wait">
        {phase === "done" && (
          <motion.div
            key={run}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <DemoPanel className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="relative size-16 shrink-0">
                  <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden>
                    <circle cx="50" cy="50" r="42" fill="none" strokeWidth="10" className="stroke-neutral-200 dark:stroke-neutral-800" />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      strokeWidth="10"
                      strokeLinecap="round"
                      className="stroke-sky-500"
                      initial={{ pathLength: reduceMotion ? OVERALL / 100 : 0 }}
                      animate={{ pathLength: OVERALL / 100 }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xl font-semibold tabular-nums">{OVERALL}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-neutral-500">{t("notes.essay.result.overall")}</span>
                  <span className="text-lg font-semibold text-sky-600 dark:text-sky-400">{t("notes.essay.levels.good")}</span>
                </div>
              </div>

              <ul className="grid gap-2.5 sm:grid-cols-2">
                {CRITERIA.map((criterion, index) => (
                  <li key={criterion.key} className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-600 dark:text-neutral-300">{t(`notes.essay.criteria.${criterion.key}`)}</span>
                      <span className="font-semibold tabular-nums">{criterion.score}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                      <motion.div
                        className={cn("h-full rounded-full", criterion.score >= 75 ? "bg-sky-500" : "bg-violet-500")}
                        initial={{ width: reduceMotion ? `${criterion.score}%` : 0 }}
                        animate={{ width: `${criterion.score}%` }}
                        transition={{ duration: 0.7, delay: reduceMotion ? 0 : 0.2 + index * 0.1 }}
                      />
                    </div>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-1.5 border-t border-neutral-100 pt-3 text-sm dark:border-neutral-800">
                {(
                  [
                    { from: MISTAKE_ONE, to: "people think", category: "Grammar" },
                    { from: MISTAKE_TWO, to: "opportunities", category: "Spelling" },
                  ] as const
                ).map((fix) => (
                  <p key={fix.from} lang="en" className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-neutral-500 dark:bg-neutral-800">
                      {t(`notes.essay.categories.${fix.category}`)}
                    </span>
                    <span className="text-rose-600 line-through dark:text-rose-400">{fix.from}</span>
                    <LuArrowRight className="text-neutral-400" aria-hidden />
                    <span className="font-medium text-emerald-700 dark:text-emerald-400">{fix.to}</span>
                  </p>
                ))}
              </div>
            </DemoPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
