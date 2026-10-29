"use client";

import { FC, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LuCheck } from "react-icons/lu";
import { cn } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";

const OPTIONS = [
  { id: "glucose", isCorrect: true },
  { id: "carbonDioxide", isCorrect: false },
  { id: "oxygen", isCorrect: true },
  { id: "nitrogen", isCorrect: false },
] as const;

const CONFIDENCE = ["low", "medium", "high"] as const;
type Confidence = (typeof CONFIDENCE)[number];

// Same rule as the backend: every wrong pick cancels one right pick
function grade(selected: string[]) {
  const correct: string[] = OPTIONS.filter((o) => o.isCorrect).map((o) => o.id);
  const right = selected.filter((id) => correct.includes(id)).length;
  const wrong = selected.length - right;
  const isCorrect = right === correct.length && wrong === 0;
  const score = (Math.max(0, right - wrong) * 100) / correct.length;

  return { isCorrect, score };
}

export const DefendDemo: FC = () => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [selected, setSelected] = useState<string[]>([]);
  const [confidence, setConfidence] = useState<Confidence>("medium");
  const [result, setResult] = useState<ReturnType<typeof grade> | null>(null);

  const toggle = (id: string) => {
    if (result) return;
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const reset = () => {
    setSelected([]);
    setResult(null);
  };

  const feedback = !result
    ? null
    : result.isCorrect
      ? confidence === "low"
        ? t("landing.demo.defend.feedback.rightUnsure")
        : t("landing.demo.defend.feedback.rightSure")
      : confidence === "high"
        ? t("landing.demo.defend.feedback.wrongSure")
        : t("landing.demo.defend.feedback.wrong");

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-neutral-100 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex flex-col gap-1">
        <span className="text-sm text-neutral-500">{t("landing.demo.defend.counter")}</span>
        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
          {t("landing.demo.questions.options.title")}
        </span>
        <span className="text-sm text-neutral-500">
          {t("attempt.chooseAll")}
        </span>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {OPTIONS.map((option, index) => {
          const isSelected = selected.includes(option.id);
          const showCorrect = result && option.isCorrect;

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isSelected}
              disabled={!!result}
              onClick={() => toggle(option.id)}
              className={cn(
                "flex items-center justify-between rounded-xl px-4 py-3 text-left font-medium transition-colors",
                isSelected
                  ? "bg-emerald-700 text-white"
                  : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700",
                result && !isSelected && "opacity-60",
              )}
            >
              <span>
                <span className="mr-2 opacity-70">
                  {String.fromCharCode(65 + index)}.
                </span>
                {t(`landing.demo.questions.options.items.${option.id}`)}
              </span>
              {showCorrect && <LuCheck aria-label={t("results.correctAnswer")} />}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-neutral-500">
          {t("attempt.confidenceQuestion")}
        </span>
        <div className="flex gap-2">
          {CONFIDENCE.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={confidence === item}
              disabled={!!result}
              onClick={() => setConfidence(item)}
              className={cn(
                "flex-1 rounded-xl py-2 text-sm font-medium transition-colors",
                confidence === item
                  ? "bg-emerald-700 text-white"
                  : "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
              )}
            >
              {t(`attempt.confidence.${item}`)}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {result ? (
          <motion.div
            key="result"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-col gap-1">
              <span
                className={cn(
                  "font-semibold",
                  result.isCorrect
                    ? "text-emerald-600"
                    : result.score > 0
                      ? "text-amber-600"
                      : "text-red-500",
                )}
              >
                {result.isCorrect
                  ? t("results.status.correct")
                  : result.score > 0
                    ? t("results.status.partly")
                    : t("results.status.wrong")}{" "}
                · {t("landing.demo.defend.score", { score: result.score })}
              </span>
              <span className="text-sm text-neutral-500">{feedback}</span>
            </div>
            <button
              type="button"
              onClick={reset}
              className="self-start rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white sm:self-auto dark:bg-neutral-100 dark:text-neutral-900"
            >
              {t("landing.demo.defend.tryAgain")}
            </button>
          </motion.div>
        ) : (
          <motion.button
            key="answer"
            type="button"
            exit={{ opacity: 0 }}
            disabled={selected.length === 0}
            onClick={() => setResult(grade(selected))}
            className="self-end rounded-xl bg-emerald-700 px-6 py-2 font-medium text-white transition-opacity disabled:opacity-40"
          >
            {t("landing.demo.defend.answer")}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
