"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { LuPlay, LuShuffle } from "react-icons/lu";
import { Button, Skeleton } from "@/shared/radix-ui";
import {
  FlashcardSessionModeEnum,
  IFlashcardSessionCreate,
  useFlashcardStats,
} from "@/entities/flashcard";
import { DEFAULT_SESSION_SIZE, MAX_SESSION_SIZE } from "../../consts";
import { EmptyFlashcards } from "../EmptyFlashcards/empty-flashcards";

interface FlashcardsStartProps {
  dictionaryId: string;
  isPending: boolean;
  onStart: (body: IFlashcardSessionCreate) => void;
}

export const FlashcardsStart: FC<FlashcardsStartProps> = ({
  dictionaryId,
  isPending,
  onStart,
}) => {
  const { flashcardStatsData, flashcardStatsIsPending } =
    useFlashcardStats(dictionaryId);

  if (flashcardStatsIsPending) {
    return (
      <div className="flex flex-col w-full items-center gap-5 py-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-[460px]">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
        <Skeleton className="w-full max-w-[460px] h-10" />
      </div>
    );
  }

  if (!flashcardStatsData || flashcardStatsData.total === 0) {
    return <EmptyFlashcards />;
  }

  const reviewCount = Math.min(
    flashcardStatsData.due + flashcardStatsData.new,
    DEFAULT_SESSION_SIZE,
  );
  const allCount = Math.min(flashcardStatsData.total, MAX_SESSION_SIZE);

  const tiles = [
    {
      label: "Due now",
      value: flashcardStatsData.due,
      styles: "text-emerald-600",
    },
    { label: "New", value: flashcardStatsData.new, styles: "text-sky-600" },
    {
      label: "Learning",
      value: flashcardStatsData.learning + flashcardStatsData.relearning,
      styles: "text-amber-500",
    },
    {
      label: "In review",
      value: flashcardStatsData.review,
      styles: "text-violet-700",
    },
  ];

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex flex-col w-full items-center gap-5 py-5"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-[460px]">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className="flex flex-col items-center gap-1 rounded-2xl border-3 border-white dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900 p-4"
          >
            <span className={`text-2xl font-bold ${tile.styles}`}>
              {tile.value}
            </span>
            <span className="text-xs text-neutral-500 text-center">
              {tile.label}
            </span>
          </div>
        ))}
      </div>

      <p className="text-sm text-neutral-500 text-center">
        {reviewCount > 0
          ? `Next session: ${reviewCount} ${reviewCount === 1 ? "card" : "cards"}`
          : "Nothing to review right now, come back later or practice all words"}
      </p>

      <div className="flex md:flex-row flex-col gap-3 w-full max-w-[460px]">
        <Button
          size="lg"
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
          disabled={isPending || reviewCount === 0}
          onClick={() =>
            onStart({
              mode: FlashcardSessionModeEnum.Due,
              limit: DEFAULT_SESSION_SIZE,
            })
          }
        >
          <LuPlay /> Review {reviewCount}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="flex-1"
          disabled={isPending}
          onClick={() => onStart({ mode: FlashcardSessionModeEnum.All })}
        >
          <LuShuffle /> Practice all {allCount}
        </Button>
      </div>
    </motion.div>
  );
};
