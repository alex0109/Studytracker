"use client";

import { FC, ReactNode, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { LuFlame, LuTrendingUp } from "react-icons/lu";
import { cn } from "@/shared/lib";
import { CountUp } from "../../CountUp";

const STREAK = [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1];

const CALIBRATION = [
  { label: "Not sure", value: 42 },
  { label: "Fairly sure", value: 71 },
  { label: "Confident", value: 93 },
];

export const StatisticsDemo: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const reduceMotion = useReducedMotion();
  const play = isInView || !!reduceMotion;

  return (
    <div ref={ref} className="grid gap-3 sm:grid-cols-2">
      <Tile>
        <div className="flex items-center gap-4">
          <div className="relative flex size-20 shrink-0 items-center justify-center">
            <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
              <circle cx="50" cy="50" r="42" className="fill-none stroke-neutral-800" strokeWidth="10" />
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                className="fill-none stroke-emerald-500"
                strokeWidth="10"
                strokeLinecap="round"
                initial={{ pathLength: reduceMotion ? 0.78 : 0 }}
                animate={{ pathLength: play ? 0.78 : 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <CountUp value={78} suffix="%" className="font-mono text-sm font-semibold" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-neutral-400">Overall accuracy</span>
            <span className="flex items-center gap-1 text-sm font-medium text-emerald-400">
              <LuTrendingUp /> +6% this month
            </span>
          </div>
        </div>
      </Tile>

      <Tile>
        <div className="flex items-center gap-2">
          <LuFlame className="text-amber-400" />
          <span className="text-sm text-neutral-400">Study streak</span>
          <span className="ml-auto font-semibold">12 days</span>
        </div>
        <div className="mt-3 grid grid-cols-7 gap-1.5">
          {STREAK.map((day, index) => (
            <motion.span
              key={index}
              initial={{ scale: reduceMotion ? 1 : 0 }}
              animate={{ scale: play ? 1 : 0 }}
              transition={{ delay: index * 0.03 }}
              className={cn(
                "aspect-square rounded-md",
                day ? "bg-emerald-500" : "bg-neutral-800",
              )}
            />
          ))}
        </div>
      </Tile>

      <Tile>
        <span className="text-sm text-neutral-400">
          How often you are right when you feel…
        </span>
        <ul className="mt-3 flex flex-col gap-2">
          {CALIBRATION.map((row, index) => (
            <li key={row.label} className="flex items-center gap-2 text-sm">
              <span className="w-20 shrink-0 text-neutral-300">{row.label}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-800">
                <motion.div
                  className="h-full origin-left rounded-full bg-sky-500"
                  initial={{ scaleX: reduceMotion ? row.value / 100 : 0 }}
                  animate={{ scaleX: play ? row.value / 100 : 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <span className="w-10 text-right font-mono">{row.value}%</span>
            </li>
          ))}
        </ul>
      </Tile>

      <Tile>
        <span className="text-sm text-neutral-400">Weakest topic</span>
        <div className="mt-3 flex items-center justify-between">
          <span className="rounded-xl bg-rose-500/15 px-3 py-1 font-medium text-rose-300">
            #chemistry
          </span>
          <span className="font-mono text-2xl font-semibold text-rose-400">
            54%
          </span>
        </div>
        <span className="mt-2 block text-sm text-neutral-400">
          Next thing to strengthen
        </span>
      </Tile>
    </div>
  );
};

const Tile: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 text-neutral-50">
    {children}
  </div>
);
