"use client";

import { useTranslation } from "@/shared/i18n";
import { FC } from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib";
import { FlashcardAnswerEnum } from "../../model";
import { FLASHCARD_ANSWER_OPTIONS } from "../../consts";

interface FlashcardsProgressProps {
  current: number;
  total: number;
  counts: Record<FlashcardAnswerEnum, number>;
}

export const FlashcardsProgress: FC<FlashcardsProgressProps> = ({
  current,
  total,
  counts,
}) => {
  const { t } = useTranslation();
  const answered = current - 1;

  return (
    <div className="flex flex-col w-full max-w-[460px] gap-2">
      <div className="flex justify-between items-center text-sm text-neutral-500">
        <span>
          Card {current} of {total}
        </span>
        <div className="flex gap-3">
          {FLASHCARD_ANSWER_OPTIONS.map(
            ({ value, icon: Icon, textStyles }) => (
              <span
                key={value}
                title={t(`flashcards.answers.${value}`)}
                className={cn("flex items-center gap-1 font-medium", textStyles)}
              >
                <Icon /> {counts[value]}
              </span>
            ),
          )}
        </div>
      </div>
      <div className="h-2 w-full rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-emerald-600"
          initial={false}
          animate={{ width: `${(answered / total) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};
