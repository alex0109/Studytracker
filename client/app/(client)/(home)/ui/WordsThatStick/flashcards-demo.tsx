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
import { sampleEntries } from "../../lib/sample-entries";

type Answer = "dontKnow" | "unsure" | "know";

const ANSWERS: { value: Answer; label: string; icon: typeof LuX; styles: string }[] = [
  { value: "dontKnow", label: "Don't know", icon: LuX, styles: "bg-red-500 hover:bg-red-600" },
  { value: "unsure", label: "Not sure", icon: LuCircleHelp, styles: "bg-amber-500 hover:bg-amber-600" },
  { value: "know", label: "Know", icon: LuCheck, styles: "bg-emerald-600 hover:bg-emerald-700" },
];

const EXIT: Record<Answer, { x: number; y: number; rotate: number }> = {
  dontKnow: { x: -320, y: 0, rotate: -12 },
  unsure: { x: 0, y: 320, rotate: 0 },
  know: { x: 320, y: 0, rotate: 12 },
};

export const FlashcardsDemo: FC = () => {
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
          <div className="absolute inset-0 translate-y-6 scale-90 rounded-2xl border-3 border-white bg-gray-50 opacity-50 shadow-sm" />
        )}
        {remaining > 1 && (
          <div className="absolute inset-0 translate-y-3 scale-95 rounded-2xl border-3 border-white bg-gray-50 opacity-80 shadow-sm" />
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
                    ? `Hide translation of ${current.term}`
                    : `Show translation of ${current.term}`
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
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl border-3 border-white bg-white p-6 text-center shadow-md"
          >
            <span className="text-2xl font-semibold text-neutral-900">
              Deck done
            </span>
            <p className="text-neutral-600">
              {missed === 0
                ? "You knew every word. They will wait a few days before coming back."
                : `${missed} ${missed === 1 ? "word is" : "words are"} already scheduled to come back sooner.`}
            </p>
            <button
              type="button"
              onClick={restart}
              className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
            >
              <LuRotateCcw /> Try again
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
            <answer.icon /> {answer.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-neutral-500">
        Tap the card to flip it. In the app you can also swipe it.
      </p>
    </div>
  );
};
