"use client";

import { FC, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LuFlame } from "react-icons/lu";
import { DictionaryFlipCard } from "@/entities/dictionary";
import { cn } from "@/shared/lib";
import { CountUp } from "../CountUp";
import { sampleEntries } from "../../lib/sample-entries";

// Days of the last two weeks the user studied, for the streak strip
const STREAK = [1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1];

export const HeroPreview: FC = () => {
  const reduceMotion = useReducedMotion();
  const [isFlipped, setIsFlipped] = useState(false);

  const enter = (delay: number) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, type: "spring" as const, stiffness: 120, damping: 20 },
  });

  return (
    <div className="relative mx-auto h-[440px] w-full max-w-[460px]">
      <motion.div
        {...enter(0.15)}
        className="absolute left-0 right-8 top-0 h-[250px] -rotate-2"
      >
        <button
          type="button"
          aria-label={isFlipped ? "Show the word" : "Show the translation"}
          onClick={() => setIsFlipped((prev) => !prev)}
          className="h-full w-full cursor-pointer rounded-2xl text-left"
        >
          <DictionaryFlipCard entry={sampleEntries[0]} isFlipped={isFlipped} />
        </button>
      </motion.div>

      <motion.div
        {...enter(0.3)}
        className="absolute bottom-6 left-0 flex w-[158px] rotate-2 flex-col items-center gap-2 rounded-2xl border-3 border-white bg-neutral-900 p-4 text-white shadow-xl sm:left-4 sm:w-[210px] sm:p-5"
      >
        <span className="text-xs uppercase tracking-wider text-neutral-400">
          Attempt score
        </span>
        <div className="relative flex size-24 items-center justify-center">
          <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="42"
              className="fill-none stroke-neutral-700"
              strokeWidth="10"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="42"
              className="fill-none stroke-emerald-500"
              strokeWidth="10"
              strokeLinecap="round"
              initial={{ pathLength: reduceMotion ? 0.86 : 0 }}
              animate={{ pathLength: 0.86 }}
              transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
            />
          </svg>
          <CountUp value={86} className="text-2xl font-semibold" />
        </div>
        <span className="text-center text-xs text-neutral-400">
          hard ×3 · medium ×2 · easy ×1
        </span>
      </motion.div>

      <motion.div
        {...enter(0.45)}
        className="absolute bottom-0 right-0 flex w-[178px] -rotate-1 flex-col gap-3 rounded-2xl border-3 border-white bg-white/90 p-3 shadow-xl backdrop-blur sm:w-[230px] sm:p-4"
      >
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <LuFlame />
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-neutral-900">
              12-day streak
            </span>
            <span className="text-xs text-neutral-500">last two weeks</span>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {STREAK.map((day, index) => (
            <motion.span
              key={index}
              initial={{ scale: reduceMotion ? 1 : 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7 + index * 0.04 }}
              className={cn(
                "aspect-square rounded-md",
                day ? "bg-emerald-500" : "bg-neutral-200",
              )}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};
