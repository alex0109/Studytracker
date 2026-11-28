"use client";

import { useTranslation } from "@/shared/i18n";

import { FC, useEffect, useRef, useState } from "react";
import { LuUndo2 } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { cn } from "@/shared/lib";
import { useLatest } from "@/shared/hooks";
import { IFlashcardSessionResponse } from "@/entities/flashcard";
import { IDictionaryEntryResponse } from "@/entities/dictionary";
import {
  FlashcardAnswerEnum,
  IDeckAnswer,
  ISwipeableCardHandle,
} from "../../model";
import { ANSWER_RATINGS } from "../../consts";
import { useFlashcardReviewSync } from "../../hooks/useFlashcardReviewSync";
import { SwipeableCard } from "../SwipeableCard/swipeable-card";
import { FlashcardsSummary } from "../FlashcardsSummary/flashcards-summary";
import { WordQuiz } from "../WordQuiz/word-quiz";
import { LetterChallenge } from "../LetterChallenge/letter-challenge";
import { canMakeLetterPuzzle } from "../../lib/letter-puzzle";
import { FlashcardsProgress } from "./flashcards-progress";
import { AnswerButtons } from "./answer-buttons";
import { DirectionSwitch } from "./direction-switch";
import { CardDirectionScope, isReversed, useCardDirection } from "../../lib/card-direction";
import { Spinner } from "@/shared/ui";

interface FlashcardsDeckProps {
  session: IFlashcardSessionResponse;
  isRepeatPending: boolean;
  onRepeat: (entryIds: string[]) => void;
  onRestart: () => void;
  continueLabel?: string;
  // Off where answers count for the schedule: taking back a wrong answer until it is right
  // would make every word look known
  canUndo?: boolean;
  // After the quiz of a word answered "don't know" or "not sure", its letters are put in order
  letterChallenge?: boolean;
  // Where the "show first" choice is kept and what it is before one is made
  directionScope?: CardDirectionScope;
  // Set where the deck is one step of a longer flow: no summary to click through, the flow goes on
  // by itself once every answer is saved
  onFinished?: (counts: Record<FlashcardAnswerEnum, number>) => void;
  // Told when the last card is answered and saved; the summary still shows
  onComplete?: () => void;
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
  continueLabel,
  canUndo = true,
  letterChallenge = false,
  directionScope,
  onFinished,
  onComplete,
}) => {
  const { t } = useTranslation();
  const queue = session.cards;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, IDeckAnswer>>({});
  const [isFlipped, setIsFlipped] = useState(false);
  // A word answered "don't know" or "not sure" is checked with a small quiz before the next one
  const [quizEntry, setQuizEntry] = useState<IDictionaryEntryResponse | null>(null);
  // Then, where it's on, the same word is put together from its letters
  const [spellEntry, setSpellEntry] = useState<IDictionaryEntryResponse | null>(null);

  const { direction, setDirection } = useCardDirection(directionScope);
  const cardRef = useRef<ISwipeableCardHandle>(null);
  // Set when each card shows up, see the effect on index below
  const shownAt = useRef(0);

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
    setIsFlipped(false);

    if (answer === FlashcardAnswerEnum.Know) setIndex((prev) => prev + 1);
    else setQuizEntry(current);
  };

  const handleQuizDone = () => {
    const entry = quizEntry;
    setQuizEntry(null);
    if (letterChallenge && entry && canMakeLetterPuzzle(entry.term)) {
      setSpellEntry(entry);
      return;
    }
    setIndex((prev) => prev + 1);
  };

  const handleSpellDone = () => {
    setSpellEntry(null);
    setIndex((prev) => prev + 1);
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

  // finish is a new function on every render, but the session ends only once
  const finishRef = useLatest(finish);
  const onFinishedRef = useLatest(onFinished);
  const onCompleteRef = useLatest(onComplete);
  const countsRef = useLatest(counts);

  useEffect(() => {
    if (!isFinished) return;
    void finishRef.current().then(() => {
      onCompleteRef.current?.();
      onFinishedRef.current?.(countsRef.current);
    });
  }, [isFinished, finishRef, onFinishedRef, onCompleteRef, countsRef]);

  useEffect(() => {
    // The quiz and the letters have keys of their own
    if (!current || quizEntry || spellEntry) return;

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
  }, [current, quizEntry, spellEntry]);

  if (isFinished && onFinished) {
    return (
      <div className="flex min-h-60 items-center justify-center text-2xl text-neutral-400">
        <Spinner />
      </div>
    );
  }

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
        continueLabel={continueLabel}
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

      <DirectionSwitch value={direction} onChange={setDirection} />

      {/* A swiped card needs a fixed stage; a quiz or a long word to spell grows it instead of scrolling */}
      <div
        className={cn(
          "relative w-full max-w-[460px]",
          quizEntry || spellEntry ? "min-h-[340px] md:min-h-[380px]" : "h-[340px] md:h-[380px]",
        )}
      >
        {remaining > 2 && (
          <div className="absolute inset-0 translate-y-6 scale-90 rounded-2xl border-3 border-white dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 shadow-sm opacity-50" />
        )}
        {remaining > 1 && (
          <div className="absolute inset-0 translate-y-3 scale-95 rounded-2xl border-3 border-white dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 shadow-sm opacity-80" />
        )}
        {quizEntry ? (
          <WordQuiz key={quizEntry.id} entry={quizEntry} onDone={handleQuizDone} />
        ) : spellEntry ? (
          <LetterChallenge key={spellEntry.id} entry={spellEntry} onDone={handleSpellDone} />
        ) : (
          <SwipeableCard
            key={current.id}
            ref={cardRef}
            entry={current}
            reversed={isReversed(direction, current.id)}
            isFlipped={isFlipped}
            onFlip={() => setIsFlipped((prev) => !prev)}
            onAnswer={handleAnswer}
          />
        )}
      </div>

      {/* Only the right choice in the quiz lets the next word come */}
      {!quizEntry && !spellEntry && <AnswerButtons onAnswer={(answer) => cardRef.current?.swipe(answer)} />}

      <div className="flex w-full max-w-[460px] justify-between items-center gap-3">
        <p className="text-xs text-neutral-400">
          {quizEntry ? t("flashcards.quiz.keysHint") : spellEntry ? t("flashcards.spell.keysHint") : t("flashcards.keysHint")}
        </p>
        {canUndo && (
          <Button
            variant="ghost"
            size="sm"
            disabled={index === 0 || !!quizEntry || !!spellEntry}
            onClick={(e) => {
              e.currentTarget.blur();
              handleUndo();
            }}
          >
            <LuUndo2 /> {t("flashcards.undo")}
          </Button>
        )}
      </div>
    </div>
  );
};
