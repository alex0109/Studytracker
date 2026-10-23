"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { LuRepeat, LuShuffle } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { Subtitle, Title } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { IDictionaryEntryResponse } from "@/entities/dictionary";
import { FlashcardAnswerEnum } from "../../model";
import { FLASHCARD_ANSWER_OPTIONS } from "../../consts";

interface FlashcardsSummaryProps {
  queue: IDictionaryEntryResponse[];
  answers: Record<string, FlashcardAnswerEnum>;
  onRepeat: (entries: IDictionaryEntryResponse[]) => void;
  onRestart: () => void;
}

export const FlashcardsSummary: FC<FlashcardsSummaryProps> = ({
  queue,
  answers,
  onRepeat,
  onRestart,
}) => {
  const toRepeat = queue.filter(
    (entry) => answers[entry.id] !== FlashcardAnswerEnum.Know,
  );
  const knownCount = queue.length - toRepeat.length;
  const knownPercent = Math.round((knownCount / queue.length) * 100);

  const countOf = (answer: FlashcardAnswerEnum) =>
    queue.filter((entry) => answers[entry.id] === answer).length;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex flex-col w-full items-center gap-5 py-5"
    >
      <Title text="Round finished" />

      <div className="grid grid-cols-3 gap-3 w-full max-w-[460px]">
        {FLASHCARD_ANSWER_OPTIONS.map(
          ({ value, label, icon: Icon, textStyles }) => (
            <div
              key={value}
              className="flex flex-col items-center gap-1 rounded-2xl border-3 border-white dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900 p-4"
            >
              <Icon className={cn("size-5", textStyles)} />
              <span className="text-2xl font-bold">{countOf(value)}</span>
              <span className="text-xs text-neutral-500 text-center">
                {label}
              </span>
            </div>
          ),
        )}
      </div>

      <p className="text-neutral-500">
        You know {knownPercent}% of the words in this round
      </p>

      {toRepeat.length > 0 && (
        <div className="flex flex-col w-full max-w-[460px] gap-2">
          <Subtitle
            text="Words to practice"
            blockStyles="my-0"
            textStyles="font-semibold text-left"
          />
          {toRepeat.map((entry) => (
            <div
              key={entry.id}
              className="flex justify-between items-center gap-3 rounded-xl bg-gray-50 dark:bg-neutral-900 px-4 py-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={cn(
                    "size-2 rounded-full shrink-0",
                    answers[entry.id] === FlashcardAnswerEnum.DontKnow
                      ? "bg-red-500"
                      : "bg-amber-500",
                  )}
                />
                <span className="font-semibold truncate">{entry.term}</span>
              </div>
              <span className="text-neutral-500 truncate">
                {entry.translation}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="flex md:flex-row flex-col gap-3 w-full max-w-[460px]">
        <Button
          size="lg"
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
          disabled={toRepeat.length === 0}
          onClick={() => onRepeat(toRepeat)}
        >
          <LuRepeat /> Repeat {toRepeat.length}{" "}
          {toRepeat.length === 1 ? "word" : "words"}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="flex-1"
          onClick={onRestart}
        >
          <LuShuffle /> Start over
        </Button>
      </div>
    </motion.div>
  );
};
