"use client";

import { FC, ReactNode, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LuCheck } from "react-icons/lu";
import { cn } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";

type DemoType = "open" | "options" | "trueFalse";

const TYPES: DemoType[] = ["open", "options", "trueFalse"];

const OPTIONS = [
  { key: "glucose", isCorrect: true },
  { key: "oxygen", isCorrect: true },
  { key: "carbonDioxide", isCorrect: false },
  { key: "water", isCorrect: false },
] as const;

export const QuestionsDemo: FC = () => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [type, setType] = useState<DemoType>("options");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2" role="group" aria-label={t("landing.demo.questions.typeLabel")}>
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
                : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700",
            )}
          >
            {t(`questions.types.${item}`)}
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
          className="flex flex-col gap-3 rounded-2xl border border-neutral-100 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
        >
          {type === "open" && (
            <>
              <QuestionHeader title={t("landing.demo.questions.open.title")} difficulty="easy" />
              <p className="rounded-xl bg-neutral-100 p-3 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                {t("landing.demo.questions.open.answer")}
              </p>
              <Footnote>{t("landing.demo.questions.open.note")}</Footnote>
            </>
          )}

          {type === "options" && (
            <>
              <QuestionHeader title={t("landing.demo.questions.options.title")} difficulty="medium" />
              <ul className="flex flex-col gap-2">
                {OPTIONS.map((option) => (
                  <li key={option.key} className="flex items-center gap-2">
                    <span
                      className={cn(
                        "flex size-6 items-center justify-center rounded-md border-2",
                        option.isCorrect
                          ? "border-emerald-700 bg-emerald-700 text-white"
                          : "border-neutral-300 text-transparent dark:border-neutral-600",
                      )}
                    >
                      <LuCheck className="size-3.5" />
                    </span>
                    <span className="text-neutral-800 dark:text-neutral-200">
                      {t(`landing.demo.questions.options.items.${option.key}`)}
                    </span>
                  </li>
                ))}
              </ul>
              <Footnote>{t("landing.demo.questions.options.note")}</Footnote>
            </>
          )}

          {type === "trueFalse" && (
            <>
              <QuestionHeader title={t("landing.demo.questions.trueFalse.title")} difficulty="hard" />
              <div className="flex gap-2">
                <span className="flex-1 rounded-xl bg-neutral-200 py-2 text-center text-sm font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                  {t("questions.true")}
                </span>
                <span className="flex-1 rounded-xl bg-emerald-700 py-2 text-center text-sm font-medium text-white">
                  {t("questions.false")}
                </span>
              </div>
              <Footnote>{t("landing.demo.questions.trueFalse.note")}</Footnote>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const DIFFICULTY_STYLES = {
  easy: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  medium: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  hard: "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
};

const QuestionHeader: FC<{
  title: string;
  difficulty: keyof typeof DIFFICULTY_STYLES;
}> = ({ title, difficulty }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-start justify-between gap-3">
      <span className="font-semibold text-neutral-900 dark:text-neutral-100">{title}</span>
      <span
        className={cn(
          "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
          DIFFICULTY_STYLES[difficulty],
        )}
      >
        {t(`questions.difficulty.${difficulty}`)}
      </span>
    </div>
  );
};

const Footnote: FC<{ children: ReactNode }> = ({ children }) => (
  <p className="text-sm text-neutral-500 dark:text-neutral-400">{children}</p>
);
