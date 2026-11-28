"use client";

import { useState } from "react";

// Which side of a card comes first: the word, its translation, or either, card by card
export type CardDirection = "term" | "translation" | "mixed";

const KEY = "flashcards-direction";
const DIRECTIONS: CardDirection[] = ["term", "translation", "mixed"];

// Where a deck keeps the choice and what it shows before one is made. "Today" has its own,
// mixed from the start: a word is known only when it is known both ways
export interface CardDirectionScope {
  key: string;
  fallback: CardDirection;
}

export const PRACTICE_DIRECTION: CardDirectionScope = { key: KEY, fallback: "term" };
export const TODAY_DIRECTION: CardDirectionScope = { key: `${KEY}-today`, fallback: "mixed" };

const read = ({ key, fallback }: CardDirectionScope): CardDirection => {
  try {
    const value = window.localStorage.getItem(key);
    return DIRECTIONS.includes(value as CardDirection) ? (value as CardDirection) : fallback;
  } catch {
    return fallback;
  }
};

// The choice is the user's habit, so it stays for the next sessions on this device
export const useCardDirection = (scope: CardDirectionScope = PRACTICE_DIRECTION) => {
  const [direction, setDirection] = useState<CardDirection>(() =>
    typeof window === "undefined" ? scope.fallback : read(scope),
  );

  const change = (next: CardDirection) => {
    setDirection(next);
    try {
      window.localStorage.setItem(scope.key, next);
    } catch {
      // Private mode: the choice lasts for this page only
    }
  };

  return { direction, setDirection: change };
};

// Mixed: the same card always shows the same side first, so flipping back and forth isn't confusing
export const isReversed = (direction: CardDirection, entryId: string) =>
  direction === "translation" || (direction === "mixed" && [...entryId].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 2 === 1);
