"use client";

import { FC, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LuCheck } from "react-icons/lu";
import { cn } from "@/shared/lib";

type DemoType = "Open" | "Options" | "True / False";

const TYPES: DemoType[] = ["Open", "Options", "True / False"];

const OPTIONS = [
  { name: "Glucose", isCorrect: true },
  { name: "Oxygen", isCorrect: true },
  { name: "Carbon dioxide", isCorrect: false },
  { name: "Water", isCorrect: false },
];

export const QuestionsDemo: FC = () => {
  const reduceMotion = useReducedMotion();
  const [type, setType] = useState<DemoType>("Options");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2" role="group" aria-label="Question type">
        {TYPES.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={type === item}
            onClick={() => setType(item)}
            className={cn(
              "flex-1 rounded-xl py-2 text-sm font-medium transition-colors",
              type === item
                ? "bg-emerald-700 text-white"
                : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={type}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-3 rounded-2xl border border-neutral-100 bg-white p-5"
        >
          {type === "Open" && (
            <>
              <QuestionHeader title="What light does chlorophyll absorb best?" difficulty="Easy" />
              <p className="rounded-xl bg-gray-100 p-3 text-neutral-700">
                Red and blue light
              </p>
              <Footnote>
                Typed “red and blu light”? Fuzzy matching still counts it.
              </Footnote>
            </>
          )}

          {type === "Options" && (
            <>
              <QuestionHeader title="Which are products of photosynthesis?" difficulty="Medium" />
              <ul className="flex flex-col gap-2">
                {OPTIONS.map((option) => (
                  <li key={option.name} className="flex items-center gap-2">
                    <span
                      className={cn(
                        "flex size-6 items-center justify-center rounded-md border-2",
                        option.isCorrect
                          ? "border-emerald-700 bg-emerald-700 text-white"
                          : "border-neutral-300 text-transparent",
                      )}
                    >
                      <LuCheck className="size-3.5" />
                    </span>
                    <span className="text-neutral-800">{option.name}</span>
                  </li>
                ))}
              </ul>
              <Footnote>
                One or more correct answers. Partial picks earn partial credit.
              </Footnote>
            </>
          )}

          {type === "True / False" && (
            <>
              <QuestionHeader title="Plants release oxygen only at night." difficulty="Hard" />
              <div className="flex gap-2">
                <span className="flex-1 rounded-xl bg-neutral-200 py-2 text-center text-sm font-medium text-neutral-700">
                  True
                </span>
                <span className="flex-1 rounded-xl bg-emerald-700 py-2 text-center text-sm font-medium text-white">
                  False
                </span>
              </div>
              <Footnote>One statement, one tap.</Footnote>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const DIFFICULTY_STYLES = {
  Easy: "bg-emerald-50 text-emerald-700",
  Medium: "bg-amber-50 text-amber-700",
  Hard: "bg-rose-50 text-rose-700",
};

const QuestionHeader: FC<{
  title: string;
  difficulty: keyof typeof DIFFICULTY_STYLES;
}> = ({ title, difficulty }) => (
  <div className="flex items-start justify-between gap-3">
    <span className="font-semibold text-neutral-900">{title}</span>
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
        DIFFICULTY_STYLES[difficulty],
      )}
    >
      {difficulty}
    </span>
  </div>
);

const Footnote: FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-sm text-neutral-500">{children}</p>
);
