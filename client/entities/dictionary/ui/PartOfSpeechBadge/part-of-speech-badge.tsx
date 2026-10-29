"use client";

import { FC } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib";
import { PartOfSpeechEnum } from "../../model";

interface PartOfSpeechBadgeProps {
  partOfSpeech?: PartOfSpeechEnum;
  className?: string;
}

const PART_OF_SPEECH_STYLES: Record<PartOfSpeechEnum, string> = {
  [PartOfSpeechEnum.Noun]: "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300",
  [PartOfSpeechEnum.Pronoun]: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
  [PartOfSpeechEnum.Verb]: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  [PartOfSpeechEnum.Adjective]: "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300",
  [PartOfSpeechEnum.Adverb]: "bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300",
  [PartOfSpeechEnum.Preposition]: "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
  [PartOfSpeechEnum.Conjunction]: "bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300",
  [PartOfSpeechEnum.Interjection]: "bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300",
};

export const PartOfSpeechBadge: FC<PartOfSpeechBadgeProps> = ({
  partOfSpeech,
  className,
}) => {
  const { t } = useTranslation();

  if (!partOfSpeech) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-xl px-2 py-0.5 text-xs font-medium",
        PART_OF_SPEECH_STYLES[partOfSpeech] ?? "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
        className,
      )}
    >
      {t(`dictionary.partOfSpeech.${partOfSpeech}`)}
    </span>
  );
};
