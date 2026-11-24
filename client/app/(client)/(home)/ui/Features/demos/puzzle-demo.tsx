"use client";

import { FC, useState } from "react";
import { LuCheck, LuRotateCcw } from "react-icons/lu";
import { cn } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";
import { DemoPanel } from "./demo-card";

// The letters of a learnt word, mixed: put them back in order. The same challenge appears after reviews
export const PuzzleDemo: FC = () => {
  const { t } = useTranslation();
  const word = t("landing.features.demo.puzzle.word").toUpperCase();
  // A fixed mix, the same on the server and in the browser: the letters backwards, then the first two swapped
  const backwards = [...word].map((letter, index) => ({ letter, index })).reverse();
  const mixed = backwards.length > 2 ? [backwards[1], backwards[0], ...backwards.slice(2)] : backwards;
  const [picked, setPicked] = useState<number[]>([]);

  const guess = picked.map((index) => word[index]).join("");
  const solved = guess === word;
  const wrong = picked.length === word.length && !solved;

  return (
    <DemoPanel className="flex flex-col items-center gap-3">
      <p className="text-sm text-neutral-500">
        {t("landing.features.demo.puzzle.hint")} <span className="font-semibold text-neutral-800 dark:text-neutral-200">{t("landing.features.demo.puzzle.translation")}</span>
      </p>
      <div className="flex gap-1.5" aria-live="polite">
        {[...word].map((_, slot) => (
          <span
            key={slot}
            className={cn(
              "flex size-9 items-center justify-center rounded-lg border-2 text-base font-bold",
              solved ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300" : wrong ? "border-rose-400 text-rose-600" : "border-neutral-200 dark:border-neutral-700",
            )}
          >
            {guess[slot] ?? ""}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-1.5">
        {mixed.map(({ letter, index }) => (
          <button
            key={index}
            type="button"
            disabled={picked.includes(index) || solved}
            onClick={() => setPicked([...picked, index])}
            className="flex size-9 items-center justify-center rounded-lg bg-neutral-100 font-bold text-neutral-800 transition hover:bg-violet-100 disabled:opacity-30 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-violet-950"
          >
            {letter}
          </button>
        ))}
      </div>
      {solved ? (
        <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
          <LuCheck aria-hidden /> {t("landing.features.demo.puzzle.solved")}
        </span>
      ) : (
        picked.length > 0 && (
          <button type="button" onClick={() => setPicked([])} className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200">
            <LuRotateCcw aria-hidden /> {t("landing.features.demo.puzzle.reset")}
          </button>
        )
      )}
    </DemoPanel>
  );
};
