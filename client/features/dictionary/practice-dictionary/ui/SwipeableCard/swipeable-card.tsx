"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import {
  animate,
  motion,
  PanInfo,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  DictionaryFlipCard,
  IDictionaryEntryResponse,
} from "@/entities/dictionary";
import { FlashcardAnswerEnum, ISwipeableCardHandle } from "../../model";
import { SWIPE_EXIT_DISTANCE, SWIPE_THRESHOLD } from "../../consts";
import { getSwipeAnswer } from "../../lib";

interface SwipeableCardProps {
  entry: IDictionaryEntryResponse;
  isFlipped: boolean;
  onFlip: () => void;
  onAnswer: (answer: FlashcardAnswerEnum) => void;
}

const EXIT_TARGETS: Record<FlashcardAnswerEnum, { x: number; y: number }> = {
  [FlashcardAnswerEnum.Know]: { x: SWIPE_EXIT_DISTANCE, y: 0 },
  [FlashcardAnswerEnum.DontKnow]: { x: -SWIPE_EXIT_DISTANCE, y: 0 },
  [FlashcardAnswerEnum.Unsure]: { x: 0, y: SWIPE_EXIT_DISTANCE },
};

const stampStyles =
  "pointer-events-none absolute rounded-xl border-3 bg-white/80 px-3 py-1 text-lg font-bold uppercase";

export const SwipeableCard = forwardRef<
  ISwipeableCardHandle,
  SwipeableCardProps
>(({ entry, isFlipped, onFlip, onAnswer }, ref) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const opacity = useTransform<number, number>([x, y], ([latestX, latestY]) =>
    Math.max(
      0,
      1 - Math.max(Math.abs(latestX), latestY) / SWIPE_EXIT_DISTANCE,
    ),
  );
  const knowOpacity = useTransform(x, [20, SWIPE_THRESHOLD], [0, 1]);
  const dontKnowOpacity = useTransform(x, [-SWIPE_THRESHOLD, -20], [1, 0]);
  const unsureOpacity = useTransform(y, [20, SWIPE_THRESHOLD], [0, 1]);

  const isLeaving = useRef(false);
  const isDragged = useRef(false);

  const swipe = async (answer: FlashcardAnswerEnum) => {
    if (isLeaving.current) return;
    isLeaving.current = true;

    const target = EXIT_TARGETS[answer];
    await Promise.all([
      animate(x, target.x, { duration: 0.3, ease: "easeIn" }),
      animate(y, target.y, { duration: 0.3, ease: "easeIn" }),
    ]);

    onAnswer(answer);
  };

  useImperativeHandle(ref, () => ({ swipe }));

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const answer = getSwipeAnswer(info.offset, info.velocity);

    if (answer) {
      swipe(answer);
      return;
    }

    animate(x, 0, { type: "spring", stiffness: 400, damping: 30 });
    animate(y, 0, { type: "spring", stiffness: 400, damping: 30 });
  };

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none select-none"
      style={{ x, y, rotate, opacity }}
      drag
      dragMomentum={false}
      onPointerDown={() => (isDragged.current = false)}
      onDragStart={() => (isDragged.current = true)}
      onDragEnd={handleDragEnd}
      onClick={() => {
        if (!isDragged.current && !isLeaving.current) onFlip();
      }}
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <DictionaryFlipCard entry={entry} isFlipped={isFlipped} />

      <motion.div
        style={{ opacity: knowOpacity }}
        className={`${stampStyles} top-6 left-6 -rotate-12 border-emerald-600 text-emerald-600`}
      >
        Know
      </motion.div>
      <motion.div
        style={{ opacity: dontKnowOpacity }}
        className={`${stampStyles} top-6 right-6 rotate-12 border-red-500 text-red-500`}
      >
        Don&apos;t know
      </motion.div>
      <motion.div
        style={{ opacity: unsureOpacity }}
        className={`${stampStyles} bottom-12 left-1/2 -translate-x-1/2 border-amber-500 text-amber-500`}
      >
        Not sure
      </motion.div>
    </motion.div>
  );
});

SwipeableCard.displayName = "SwipeableCard";
