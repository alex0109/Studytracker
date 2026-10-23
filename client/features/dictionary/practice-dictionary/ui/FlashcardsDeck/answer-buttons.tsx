import { FC } from "react";
import { Button } from "@/shared/radix-ui";
import { cn } from "@/shared/lib";
import { FlashcardAnswerEnum } from "../../model";
import { FLASHCARD_ANSWER_OPTIONS } from "../../consts";

interface AnswerButtonsProps {
  onAnswer: (answer: FlashcardAnswerEnum) => void;
}

export const AnswerButtons: FC<AnswerButtonsProps> = ({ onAnswer }) => {
  return (
    <div className="flex w-full max-w-[460px] gap-2">
      {FLASHCARD_ANSWER_OPTIONS.map(({ value, label, icon: Icon, styles }) => (
        <Button
          key={value}
          size="lg"
          className={cn("flex-1 text-white", styles)}
          onClick={(e) => {
            // Drop focus so Space flips the card instead of pressing the button again
            e.currentTarget.blur();
            onAnswer(value);
          }}
        >
          <Icon /> {label}
        </Button>
      ))}
    </div>
  );
};
