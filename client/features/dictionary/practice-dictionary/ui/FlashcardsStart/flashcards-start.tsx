"use client";

import { useTranslation } from "@/shared/i18n";

import { FC, useState } from "react";
import { Spinner } from "@/shared/ui";
import { motion } from "framer-motion";
import { LuDices, LuPlay, LuShuffle } from "react-icons/lu";
import { Button, Skeleton } from "@/shared/radix-ui";
import {
  FlashcardSessionModeEnum,
  IFlashcardSessionCreate,
  useFlashcardStats,
} from "@/entities/flashcard";
import { DEFAULT_SESSION_SIZE, MAX_SESSION_SIZE } from "../../consts";
import { RandomCardsModal } from "./random-cards-modal";

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
  const { t } = useTranslation();
  // The spinner goes on the button that was pressed
  const [pressed, setPressed] = useState<FlashcardSessionModeEnum>();
  const [randomOpen, setRandomOpen] = useState(false);
  const start = (body: Parameters<typeof onStart>[0]) => {
    setPressed(body.mode);
    onStart(body);
  };
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

  // No words yet: the list under it says how to add them
  if (!flashcardStatsData || flashcardStatsData.total === 0) {
    return null;
  }

  const reviewCount = Math.min(
    flashcardStatsData.due + flashcardStatsData.new,
    DEFAULT_SESSION_SIZE,
  );
  const allCount = Math.min(flashcardStatsData.total, MAX_SESSION_SIZE);

  const tiles = [
    {
      label: t("flashcards.start.due"),
      value: flashcardStatsData.due,
      styles: "text-emerald-600",
    },
    { label: t("flashcards.start.new"), value: flashcardStatsData.new, styles: "text-sky-600" },
    {
      label: t("flashcards.start.learning"),
      value: flashcardStatsData.learning + flashcardStatsData.relearning,
      styles: "text-amber-500",
    },
    {
      label: t("flashcards.start.review"),
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
            className="flex flex-col items-center gap-1 rounded-2xl border-3 border-white dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-4"
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
          ? t("flashcards.start.next", { count: reviewCount })
          : t("flashcards.start.nothing")}
      </p>

      <div className="flex w-full max-w-[460px] flex-col gap-3">
        <Button
          size="lg"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          disabled={isPending || reviewCount === 0}
          onClick={() =>
            start({
              mode: FlashcardSessionModeEnum.Due,
              limit: DEFAULT_SESSION_SIZE,
            })
          }
        >
          {isPending && pressed === FlashcardSessionModeEnum.Due ? <Spinner /> : <LuPlay />} {t("flashcards.start.reviewButton", { count: reviewCount })}
        </Button>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto sm:flex-1"
            disabled={isPending}
            onClick={() => start({ mode: FlashcardSessionModeEnum.All })}
          >
            {isPending && pressed === FlashcardSessionModeEnum.All && !randomOpen ? <Spinner /> : <LuShuffle />} {t("flashcards.start.allButton", { count: allCount })}
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto sm:flex-1" disabled={isPending} onClick={() => setRandomOpen(true)}>
            <LuDices /> {t("flashcards.start.randomButton")}
          </Button>
        </div>
      </div>

      <RandomCardsModal
        open={randomOpen}
        onClose={() => setRandomOpen(false)}
        total={flashcardStatsData.total}
        isPending={isPending && pressed === FlashcardSessionModeEnum.All}
        onStart={(count) => start({ mode: FlashcardSessionModeEnum.All, limit: count })}
      />
    </motion.div>
  );
};
