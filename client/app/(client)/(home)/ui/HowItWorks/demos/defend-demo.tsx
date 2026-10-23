"use client";

import { FC, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LuCheck } from "react-icons/lu";
import { cn } from "@/shared/lib";

const OPTIONS = [
  { id: "glucose", name: "Glucose", isCorrect: true },
  { id: "co2", name: "Carbon dioxide", isCorrect: false },
  { id: "oxygen", name: "Oxygen", isCorrect: true },
  { id: "nitrogen", name: "Nitrogen", isCorrect: false },
];

const CONFIDENCE = ["Not sure", "Fairly sure", "Confident"] as const;
type Confidence = (typeof CONFIDENCE)[number];

// Same rule as the backend: every wrong pick cancels one right pick
function grade(selected: string[]) {
  const correct = OPTIONS.filter((o) => o.isCorrect).map((o) => o.id);
  const right = selected.filter((id) => correct.includes(id)).length;
  const wrong = selected.length - right;
  const isCorrect = right === correct.length && wrong === 0;
  const score = (Math.max(0, right - wrong) * 100) / correct.length;

  return { isCorrect, score };
}

export const DefendDemo: FC = () => {
  const reduceMotion = useReducedMotion();
  const [selected, setSelected] = useState<string[]>([]);
  const [confidence, setConfidence] = useState<Confidence>("Fairly sure");
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
      ? confidence === "Not sure"
        ? "Right, but unsure. It will come back for another review."
        : "Confident and right. That is knowledge that holds."
      : confidence === "Confident"
        ? "Confident but wrong. Statistics flag this as overconfidence."
        : "Not there yet. This question is now on your list to strengthen.";

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-neutral-100 bg-white p-5">
      <div className="flex flex-col gap-1">
        <span className="text-sm text-neutral-500">Question 1 of 6</span>
        <span className="font-semibold text-neutral-900">
          Which are products of photosynthesis?
        </span>
        <span className="text-sm text-neutral-500">
          Choose all correct answers
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
                  : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300",
                result && !isSelected && "opacity-60",
              )}
            >
              <span>
                <span className="mr-2 opacity-70">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option.name}
              </span>
              {showCorrect && <LuCheck aria-label="correct answer" />}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-neutral-500">
          How confident are you in this answer?
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
                  : "bg-neutral-200 text-neutral-700",
              )}
            >
              {item}
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
                  ? "Correct"
                  : result.score > 0
                    ? "Partly correct"
                    : "Wrong"}{" "}
                · score {result.score}
              </span>
              <span className="text-sm text-neutral-500">{feedback}</span>
            </div>
            <button
              type="button"
              onClick={reset}
              className="self-start rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white sm:self-auto"
            >
              Try again
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
            Answer
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
