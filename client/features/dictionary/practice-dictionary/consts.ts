import { IconType } from "react-icons";
import { LuCheck, LuCircleHelp, LuX } from "react-icons/lu";
import { FlashcardRatingEnum } from "@/entities/flashcard";
import { FlashcardAnswerEnum } from "./model";

export const SWIPE_THRESHOLD = 110;
export const SWIPE_VELOCITY = 650;
export const SWIPE_EXIT_DISTANCE = 700;

// Mirrors backend FlashcardLimits
export const DEFAULT_SESSION_SIZE = 20;
export const MAX_SESSION_SIZE = 200;

// Swipe answers are sent as FSRS ratings
export const ANSWER_RATINGS: Record<FlashcardAnswerEnum, FlashcardRatingEnum> = {
  [FlashcardAnswerEnum.DontKnow]: FlashcardRatingEnum.Again,
  [FlashcardAnswerEnum.Unsure]: FlashcardRatingEnum.Hard,
  [FlashcardAnswerEnum.Know]: FlashcardRatingEnum.Good,
};

// Order matches swipe directions: left, down, right
export const FLASHCARD_ANSWER_OPTIONS: {
  value: FlashcardAnswerEnum;
  label: string;
  icon: IconType;
  styles: string;
  textStyles: string;
}[] = [
  {
    value: FlashcardAnswerEnum.DontKnow,
    label: "Don't know",
    icon: LuX,
    styles: "bg-red-500 hover:bg-red-600",
    textStyles: "text-red-500",
  },
  {
    value: FlashcardAnswerEnum.Unsure,
    label: "Not sure",
    icon: LuCircleHelp,
    styles: "bg-amber-500 hover:bg-amber-600",
    textStyles: "text-amber-500",
  },
  {
    value: FlashcardAnswerEnum.Know,
    label: "Know",
    icon: LuCheck,
    styles: "bg-emerald-600 hover:bg-emerald-700",
    textStyles: "text-emerald-600",
  },
];
