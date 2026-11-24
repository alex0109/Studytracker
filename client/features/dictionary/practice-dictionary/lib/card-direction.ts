"use client";

import { useState } from "react";

// Which side of a card comes first: the word, its translation, or either, card by card
export type CardDirection = "term" | "translation" | "mixed";

const KEY = "flashcards-direction";
const DIRECTIONS: CardDirection[] = ["term", "translation", "mixed"];

const read = (): CardDirection => {
  try {
    const value = window.localStorage.getItem(KEY);
    return DIRECTIONS.includes(value as CardDirection) ? (value as CardDirection) : "term";
  } catch {
    return "term";
  }
};

// The choice is the user's habit, so it stays for the next sessions on this device
export const useCardDirection = () => {
  const [direction, setDirection] = useState<CardDirection>(() => (typeof window === "undefined" ? "term" : read()));

  const change = (next: CardDirection) => {
    setDirection(next);
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      // Private mode: the choice lasts for this page only
    }
  };

  return { direction, setDirection: change };
};

// Mixed: the same card always shows the same side first, so flipping back and forth isn't confusing
export const isReversed = (direction: CardDirection, entryId: string) =>
  direction === "translation" || (direction === "mixed" && [...entryId].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 2 === 1);
