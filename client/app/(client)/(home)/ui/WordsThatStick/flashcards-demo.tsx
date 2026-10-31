"use client";

import { FC, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  Variants,
} from "framer-motion";
import { LuCheck, LuCircleHelp, LuRotateCcw, LuX } from "react-icons/lu";
import { DictionaryFlipCard } from "@/entities/dictionary";
import { cn } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";
import { useSampleEntries } from "../../lib/sample-entries";

type Answer = "dontKnow" | "unsure" | "know";

const ANSWERS: { value: Answer; icon: typeof LuX; styles: string }[] = [
  { value: "dontKnow", icon: LuX, styles: "bg-red-500 hover:bg-red-600" },
  { value: "unsure", icon: LuCircleHelp, styles: "bg-amber-500 hover:bg-amber-600" },
  { value: "know", icon: LuCheck, styles: "bg-emerald-600 hover:bg-emerald-700" },
];

const EXIT: Record<Answer, { x: number; y: number; rotate: number }> = {
  dontKnow: { x: -320, y: 0, rotate: -12 },
  unsure: { x: 0, y: 320, rotate: 0 },
  know: { x: 320, y: 0, rotate: 12 },
};

export const FlashcardsDemo: FC = () => {
  const { t } = useTranslation();
  const sampleEntries = useSampleEntries();
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [flippedId, setFlippedId] = useState<string | null>(null);
  const [lastAnswer, setLastAnswer] = useState<Answer>("know");
  const [missed, setMissed] = useState(0);

  // Exit direction comes from the answer, passed as AnimatePresence custom
  const cardVariants: Variants = {
    enter: { opacity: 0, scale: 0.95 },
    center: { opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 },
    exit: (answer: Answer) =>
      reduceMotion ? { opacity: 0 } : { ...EXIT[answer], opacity: 0 },
  };

  const current = sampleEntries[index];
  const remaining = sampleEntries.length - index;
  const isDone = !current;

  const onAnswer = (answer: Answer) => {
    if (!current) return;

    setLastAnswer(answer);
    if (answer !== "know") setMissed((prev) => prev + 1);
    setIndex((prev) => prev + 1);
  };

  const restart = () => {
    setIndex(0);
    setMissed(0);
    setFlippedId(null);
  };

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div className="relative h-[320px] w-full max-w-[400px]">
        {remaining > 2 && (
          <div className="absolute inset-0 translate-y-6 scale-90 rounded-2xl border-3 border-white bg-neutral-50 opacity-50 shadow-sm dark:border-neutral-800 dark:bg-neutral-900" />
        )}
        {remaining > 1 && (
          <div className="absolute inset-0 translate-y-3 scale-95 rounded-2xl border-3 border-white bg-neutral-50 opacity-80 shadow-sm dark:border-neutral-800 dark:bg-neutral-900" />
        )}

        <AnimatePresence custom={lastAnswer}>
          {current && (
            <motion.div
              key={current.id}
              custom={lastAnswer}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <button
                type="button"
                aria-label={
                  flippedId === current.id
                    ? t("landing.words.hideTranslation", { term: current.term })
                    : t("landing.words.showTranslation", { term: current.term })
                }
                onClick={() =>
                  setFlippedId((prev) => (prev === current.id ? null : current.id))
                }
                className="h-full w-full cursor-pointer rounded-2xl text-left"
              >
                <DictionaryFlipCard
                  entry={current}
                  isFlipped={flippedId === current.id}
                />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {isDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl border-3 border-white bg-white p-6 text-center shadow-md dark:border-neutral-800 dark:bg-neutral-900"
          >
            <span className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
              {t("landing.words.deckDone")}
            </span>
            <p className="text-neutral-600 dark:text-neutral-400">
              {missed === 0
                ? t("landing.words.allKnown")
                : t("landing.words.missed", { count: missed })}
            </p>
            <button
              type="button"
              onClick={restart}
              className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
            >
              <LuRotateCcw /> {t("landing.demo.defend.tryAgain")}
            </button>
          </motion.div>
        )}
      </div>

      <div className="flex w-full max-w-[400px] gap-2">
        {ANSWERS.map((answer) => (
          <button
            key={answer.value}
            type="button"
            disabled={isDone}
            onClick={() => onAnswer(answer.value)}
            className={cn(
              "flex h-10 flex-1 items-center justify-center gap-1.5 rounded-2xl text-sm font-medium text-white transition disabled:opacity-40",
              answer.styles,
            )}
          >
            <answer.icon /> {t(`flashcards.answers.${answer.value}`)}
          </button>
        ))}
      </div>
      <p className="text-xs text-neutral-500">{t("landing.words.tapHint")}</p>
    </div>
  );
};
