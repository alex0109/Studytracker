"use client";

import { FC, useEffect, useRef, useState } from "react";
import { LuUndo2 } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { IFlashcardSessionResponse } from "@/entities/flashcard";
import {
  FlashcardAnswerEnum,
  IDeckAnswer,
  ISwipeableCardHandle,
} from "../../model";
import { ANSWER_RATINGS } from "../../consts";
import { useFlashcardReviewSync } from "../../hooks/useFlashcardReviewSync";
import { SwipeableCard } from "../SwipeableCard/swipeable-card";
import { FlashcardsSummary } from "../FlashcardsSummary/flashcards-summary";
import { FlashcardsProgress } from "./flashcards-progress";
import { AnswerButtons } from "./answer-buttons";

interface FlashcardsDeckProps {
  session: IFlashcardSessionResponse;
  isRepeatPending: boolean;
  onRepeat: (entryIds: string[]) => void;
  onRestart: () => void;
}

const KEY_ANSWERS: Record<string, FlashcardAnswerEnum> = {
  ArrowLeft: FlashcardAnswerEnum.DontKnow,
  ArrowRight: FlashcardAnswerEnum.Know,
  ArrowDown: FlashcardAnswerEnum.Unsure,
};

export const FlashcardsDeck: FC<FlashcardsDeckProps> = ({
  session,
  isRepeatPending,
  onRepeat,
  onRestart,
}) => {
  const queue = session.cards;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, IDeckAnswer>>({});
  const [isFlipped, setIsFlipped] = useState(false);

  const cardRef = useRef<ISwipeableCardHandle>(null);
  const shownAt = useRef(Date.now());

  const { saveReview, removeReview, finish } = useFlashcardReviewSync(session);

  const current = queue[index];
  const isFinished = index >= queue.length;
  const remaining = queue.length - index;

  const counts = Object.values(answers).reduce(
    (acc, { answer }) => ({ ...acc, [answer]: acc[answer] + 1 }),
    {
      [FlashcardAnswerEnum.Know]: 0,
      [FlashcardAnswerEnum.DontKnow]: 0,
      [FlashcardAnswerEnum.Unsure]: 0,
    },
  );

  const handleAnswer = (answer: FlashcardAnswerEnum) => {
    if (!current) return;

    const reviewId = crypto.randomUUID();
    saveReview({
      id: reviewId,
      entryId: current.id,
      rating: ANSWER_RATINGS[answer],
      durationMs: Date.now() - shownAt.current,
    });

    setAnswers((prev) => ({ ...prev, [current.id]: { answer, reviewId } }));
    setIndex((prev) => prev + 1);
    setIsFlipped(false);
  };

  const handleUndo = () => {
    if (index === 0) return;

    const previousEntry = queue[index - 1];
    const previousAnswer = answers[previousEntry.id];

    if (previousAnswer) removeReview(previousEntry.id, previousAnswer.reviewId);

    setAnswers((prev) => {
      const next = { ...prev };
      delete next[previousEntry.id];
      return next;
    });
    setIndex((prev) => prev - 1);
    setIsFlipped(false);
  };

  useEffect(() => {
    shownAt.current = Date.now();
  }, [index]);

  useEffect(() => {
    if (isFinished) finish();
  }, [isFinished]);

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

  if (isFinished) {
    return (
      <FlashcardsSummary
        queue={queue}
        answers={Object.fromEntries(
          Object.entries(answers).map(([entryId, { answer }]) => [
            entryId,
            answer,
          ]),
        )}
        isRepeatPending={isRepeatPending}
        onRepeat={(entries) => onRepeat(entries.map((entry) => entry.id))}
        onRestart={onRestart}
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
          key={current.id}
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
