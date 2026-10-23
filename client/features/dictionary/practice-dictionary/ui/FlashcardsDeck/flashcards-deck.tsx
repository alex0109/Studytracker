"use client";

import { FC, useEffect, useRef, useState } from "react";
import { LuUndo2 } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { IDictionaryEntryResponse } from "@/entities/dictionary";
import { FlashcardAnswerEnum, ISwipeableCardHandle } from "../../model";
import { shuffleEntries } from "../../lib";
import { SwipeableCard } from "../SwipeableCard/swipeable-card";
import { FlashcardsSummary } from "../FlashcardsSummary/flashcards-summary";
import { EmptyFlashcards } from "../EmptyFlashcards/empty-flashcards";
import { FlashcardsProgress } from "./flashcards-progress";
import { AnswerButtons } from "./answer-buttons";

interface FlashcardsDeckProps {
  entries: IDictionaryEntryResponse[];
}

const KEY_ANSWERS: Record<string, FlashcardAnswerEnum> = {
  ArrowLeft: FlashcardAnswerEnum.DontKnow,
  ArrowRight: FlashcardAnswerEnum.Know,
  ArrowDown: FlashcardAnswerEnum.Unsure,
};

export const FlashcardsDeck: FC<FlashcardsDeckProps> = ({ entries }) => {
  const [queue, setQueue] = useState(() => shuffleEntries(entries));
  const [index, setIndex] = useState(0);
  const [round, setRound] = useState(1);
  const [answers, setAnswers] = useState<Record<string, FlashcardAnswerEnum>>(
    {},
  );
  const [isFlipped, setIsFlipped] = useState(false);

  const cardRef = useRef<ISwipeableCardHandle>(null);

  const current = queue[index];
  const isFinished = queue.length > 0 && index >= queue.length;
  const remaining = queue.length - index;

  const counts = Object.values(answers).reduce(
    (acc, answer) => ({ ...acc, [answer]: acc[answer] + 1 }),
    {
      [FlashcardAnswerEnum.Know]: 0,
      [FlashcardAnswerEnum.DontKnow]: 0,
      [FlashcardAnswerEnum.Unsure]: 0,
    },
  );

  const startRound = (nextEntries: IDictionaryEntryResponse[]) => {
    setQueue(shuffleEntries(nextEntries));
    setIndex(0);
    setAnswers({});
    setIsFlipped(false);
    setRound((prev) => prev + 1);
  };

  const handleAnswer = (answer: FlashcardAnswerEnum) => {
    if (!current) return;

    setAnswers((prev) => ({ ...prev, [current.id]: answer }));
    setIndex((prev) => prev + 1);
    setIsFlipped(false);
  };

  const handleUndo = () => {
    if (index === 0) return;

    const previousEntry = queue[index - 1];
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[previousEntry.id];
      return next;
    });
    setIndex((prev) => prev - 1);
    setIsFlipped(false);
  };

  useEffect(() => {
    if (!current) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']"))
        return;

      const answer = KEY_ANSWERS[e.key];
      if (answer) {
        e.preventDefault();
        cardRef.current?.swipe(answer);
        return;
      }

      if (e.key === " " || e.key === "Enter") {
        // Let focused buttons handle their own activation
        if (target?.closest("button")) return;

        e.preventDefault();
        setIsFlipped((prev) => !prev);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [current]);

  if (queue.length === 0) {
    return <EmptyFlashcards />;
  }

  if (isFinished) {
    return (
      <FlashcardsSummary
        queue={queue}
        answers={answers}
        onRepeat={startRound}
        onRestart={() => startRound(entries)}
      />
    );
  }

  return (
    <div className="flex flex-col w-full items-center gap-5 py-5 overflow-hidden">
      <FlashcardsProgress
        current={index + 1}
        total={queue.length}
        counts={counts}
      />

      <div className="relative w-full max-w-[460px] h-[340px] md:h-[380px]">
        {remaining > 2 && (
          <div className="absolute inset-0 translate-y-6 scale-90 rounded-2xl border-3 border-white dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900 shadow-sm opacity-50" />
        )}
        {remaining > 1 && (
          <div className="absolute inset-0 translate-y-3 scale-95 rounded-2xl border-3 border-white dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900 shadow-sm opacity-80" />
        )}
        <SwipeableCard
          key={`${round}-${current.id}`}
          ref={cardRef}
          entry={current}
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped((prev) => !prev)}
          onAnswer={handleAnswer}
        />
      </div>

      <AnswerButtons onAnswer={(answer) => cardRef.current?.swipe(answer)} />

      <div className="flex w-full max-w-[460px] justify-between items-center gap-3">
        <p className="text-xs text-neutral-400">
          Swipe the card or use ← ↓ → keys, Space to flip
        </p>
        <Button
          variant="ghost"
          size="sm"
          disabled={index === 0}
          onClick={(e) => {
            e.currentTarget.blur();
            handleUndo();
          }}
        >
          <LuUndo2 /> Undo
        </Button>
      </div>
    </div>
  );
};
