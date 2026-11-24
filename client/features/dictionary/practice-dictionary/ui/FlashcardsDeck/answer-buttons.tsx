"use client";

import { useTranslation } from "@/shared/i18n";
import { FC } from "react";
import { Button } from "@/shared/radix-ui";
import { cn } from "@/shared/lib";
import { FlashcardAnswerEnum } from "../../model";
import { FLASHCARD_ANSWER_OPTIONS } from "../../consts";

interface AnswerButtonsProps {
  onAnswer: (answer: FlashcardAnswerEnum) => void;
}

export const AnswerButtons: FC<AnswerButtonsProps> = ({ onAnswer }) => {
  const { t } = useTranslation();
  return (
    <div className="flex w-full max-w-[460px] gap-2">
      {FLASHCARD_ANSWER_OPTIONS.map(({ value, icon: Icon, styles }) => (
        <Button
          key={value}
          size="lg"
          // On phones the icon sits over the label: three wide buttons with "Not sure" would not fit in a row
          className={cn("flex-1 text-white max-sm:h-16 max-sm:flex-col max-sm:gap-1 max-sm:[&_svg:not([class*='size-'])]:size-5", styles)}
          onClick={(e) => {
            // Drop focus so Space flips the card instead of pressing the button again
            e.currentTarget.blur();
            onAnswer(value);
          }}
        >
          <Icon /> {t(`flashcards.answers.${value}`)}
        </Button>
      ))}
    </div>
  );
};
