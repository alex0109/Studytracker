import { FC } from "react";
import { cn } from "@/shared/lib";
import { PartOfSpeechEnum } from "../../model";

interface PartOfSpeechBadgeProps {
  partOfSpeech?: PartOfSpeechEnum;
  className?: string;
}

const PART_OF_SPEECH_STYLES: Record<PartOfSpeechEnum, string> = {
  [PartOfSpeechEnum.Noun]: "bg-sky-100 text-sky-700",
  [PartOfSpeechEnum.Pronoun]: "bg-amber-100 text-amber-700",
  [PartOfSpeechEnum.Verb]: "bg-emerald-100 text-emerald-700",
  [PartOfSpeechEnum.Adjective]: "bg-purple-100 text-purple-700",
  [PartOfSpeechEnum.Adverb]: "bg-violet-100 text-violet-700",
  [PartOfSpeechEnum.Preposition]: "bg-rose-100 text-rose-700",
  [PartOfSpeechEnum.Conjunction]: "bg-teal-100 text-teal-700",
  [PartOfSpeechEnum.Interjection]: "bg-orange-100 text-orange-700",
};

export const PartOfSpeechBadge: FC<PartOfSpeechBadgeProps> = ({
  partOfSpeech,
  className,
}) => {
  if (!partOfSpeech) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-xl px-2 py-0.5 text-xs font-medium",
        PART_OF_SPEECH_STYLES[partOfSpeech] ?? "bg-neutral-100 text-neutral-700",
        className,
      )}
    >
      {partOfSpeech.toLowerCase()}
    </span>
  );
};
