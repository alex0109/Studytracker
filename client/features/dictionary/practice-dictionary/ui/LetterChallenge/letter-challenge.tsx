"use client";

import { FC, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LuArrowRight, LuLightbulb, LuPuzzle } from "react-icons/lu";
import { IDictionaryEntryResponse } from "@/entities/dictionary";
import { Button } from "@/shared/radix-ui";
import { useLatest } from "@/shared/hooks";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import {
  isComplete,
  isSolved,
  LetterPlacement,
  makeLetterPuzzle,
  placeHint,
  wrongPlaces,
} from "../../lib/letter-puzzle";

interface LetterChallengeProps {
  // The word that was just forgotten, after its quiz
  entry: IDictionaryEntryResponse;
  // Put together: the next word may come
  onDone: () => void;
}

// The word's letters, shuffled: a tap puts a letter in the next empty place, a tap on a placed
// letter takes it back. Wrong places turn red once the word is full; a hint places the next
// right letter, so the challenge never gets stuck
export const LetterChallenge: FC<LetterChallengeProps> = ({ entry, onDone }) => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const puzzle = useMemo(() => makeLetterPuzzle(entry.term), [entry.term]);
  const [placement, setPlacement] = useState<LetterPlacement>(() => puzzle.letters.map(() => null));
  // Red marks of the last full try; a place loses its mark when its letter changes
  const [marked, setMarked] = useState<number[]>([]);
  const [shake, setShake] = useState(0);

  const solved = isSolved(puzzle, placement);
  const nextButton = useRef<HTMLButtonElement>(null);
  const used = new Set(placement.filter((tile): tile is number => tile !== null));

  const settle = (next: LetterPlacement) => {
    setPlacement(next);
    if (!isComplete(next) || isSolved(puzzle, next)) return;
    setMarked(wrongPlaces(puzzle, next));
    setShake((value) => value + 1);
  };

  const put = (tile: number) => {
    if (solved || used.has(tile)) return;
    const place = placement.indexOf(null);
    if (place === -1) return;
    const next = [...placement];
    next[place] = tile;
    setMarked((value) => value.filter((item) => item !== place));
    settle(next);
  };

  const takeBack = (place: number) => {
    if (solved || placement[place] === null) return;
    const next = [...placement];
    next[place] = null;
    setMarked((value) => value.filter((item) => item !== place));
    setPlacement(next);
  };

  const hint = () => {
    if (solved) return;
    const next = placeHint(puzzle, placement);
    setMarked((value) => value.filter((place) => next[place] === placement[place]));
    settle(next);
  };

  // autoFocus doesn't reach a button that appears in a re-render, so Next is focused here
  useEffect(() => {
    if (solved) nextButton.current?.focus();
  }, [solved]);

  // Letters can be typed; Backspace takes back the last one, Enter goes on once it's solved
  const keys = useLatest({ puzzle, placement, used, solved, put, takeBack, onDone });
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const state = keys.current;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (state.solved) {
        // A focused button answers Enter itself
        if (event.key === "Enter" && !(event.target as HTMLElement | null)?.closest("button")) {
          event.preventDefault();
          state.onDone();
        }
        return;
      }

      if (event.key === "Backspace") {
        const last = state.placement.findLastIndex((tile) => tile !== null);
        if (last === -1) return;
        event.preventDefault();
        state.takeBack(last);
        return;
      }

      if (event.key.length !== 1) return;
      const tile = state.puzzle.tiles.findIndex(
        (letter, index) => !state.used.has(index) && letter.toLocaleLowerCase() === event.key.toLocaleLowerCase(),
      );
      if (tile === -1) return;
      event.preventDefault();
      state.put(tile);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [keys]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      aria-labelledby={`spell-${entry.id}`}
      className="relative flex min-h-[340px] flex-col gap-4 rounded-2xl border-3 border-white bg-neutral-50 p-5 shadow-md md:min-h-[380px] md:p-6 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300">
        <LuPuzzle aria-hidden /> {t("flashcards.spell.badge")}
      </span>

      <div className="flex flex-col items-center gap-1 text-center">
        <span id={`spell-${entry.id}`} className="text-sm text-neutral-500">
          {t("flashcards.spell.prompt")}
        </span>
        <p className="text-xl font-bold break-words md:text-2xl">{entry.translation}</p>
      </div>

      {/* The places: letters to fill, and the spaces and hyphens that stay where they are */}
      <motion.div
        key={shake}
        animate={shake && !reduceMotion ? { x: [0, -8, 8, -5, 5, 0] } : undefined}
        transition={{ duration: 0.35 }}
        className="flex flex-wrap items-center justify-center gap-1.5"
      >
        {entry.article && <span className="mr-1 text-lg text-neutral-500 dark:text-neutral-400">{entry.article}</span>}
        {puzzle.layout.map((item, index) => {
          if (item.letter === null) {
            return item.char.trim() ? (
              <span key={index} className="text-xl font-semibold text-neutral-500">
                {item.char}
              </span>
            ) : (
              <span key={index} aria-hidden className="w-3" />
            );
          }

          const place = item.letter;
          const tile = placement[place];
          const isWrong = marked.includes(place);

          return (
            <button
              key={index}
              type="button"
              disabled={tile === null || solved}
              onClick={() => takeBack(place)}
              aria-label={
                tile === null
                  ? t("flashcards.spell.emptyPlace", { number: place + 1 })
                  : t("flashcards.spell.placedLetter", { letter: puzzle.tiles[tile] })
              }
              className={cn(
                "flex h-11 w-9 items-center justify-center rounded-lg border-2 text-lg font-bold transition-colors",
                solved
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
                  : isWrong
                    ? "border-red-400 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                    : tile === null
                      ? "border-dashed border-neutral-300 dark:border-neutral-600"
                      : "border-neutral-300 bg-white hover:border-neutral-500 dark:border-neutral-600 dark:bg-neutral-800",
              )}
            >
              {/* Solved, the word shows as it is written, capitals included */}
              {solved ? item.char : tile === null ? "" : puzzle.tiles[tile].toLocaleLowerCase()}
            </button>
          );
        })}
      </motion.div>

      {/* The letters to take; a used one leaves its place empty, so the others don't jump */}
      {!solved && (
        <div className="flex flex-wrap justify-center gap-1.5">
          {puzzle.tiles.map((letter, tile) => (
            <button
              key={tile}
              type="button"
              disabled={used.has(tile)}
              onClick={() => put(tile)}
              aria-label={t("flashcards.spell.letter", { letter })}
              className={cn(
                "flex h-12 w-11 items-center justify-center rounded-lg text-xl font-bold transition sm:h-11 sm:w-10 sm:text-lg",
                used.has(tile)
                  ? "invisible"
                  : "bg-neutral-900 text-white shadow-sm hover:bg-neutral-700 motion-safe:active:scale-95 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white",
              )}
            >
              {letter.toLocaleLowerCase()}
            </button>
          ))}
        </div>
      )}

      <div className="mt-auto flex min-h-10 items-center justify-between gap-3">
        <p
          aria-live="polite"
          className={cn("text-sm font-medium", solved ? "text-emerald-600" : "text-red-500")}
        >
          {solved ? t("flashcards.quiz.right") : marked.length > 0 ? t("flashcards.spell.wrong") : ""}
        </p>
        {solved ? (
          <Button ref={nextButton} onClick={onDone} className="bg-emerald-600 text-white hover:bg-emerald-700">
            {t("flashcards.quiz.next")} <LuArrowRight aria-hidden />
          </Button>
        ) : (
          <Button variant="ghost" size="sm" onClick={hint} className="text-amber-700 dark:text-amber-300">
            <LuLightbulb aria-hidden /> {t("flashcards.spell.hint")}
          </Button>
        )}
      </div>
    </motion.section>
  );
};
