"use client";

import { CSSProperties, FC, ReactNode } from "react";
import { motion } from "framer-motion";
import { LuRotateCcw } from "react-icons/lu";
import { cn } from "@/shared/lib";
import { useTranslation } from "react-i18next";
import { IDictionaryEntryResponse } from "../../model";
import { PartOfSpeechBadge } from "../PartOfSpeechBadge/part-of-speech-badge";
import { EntryTerm } from "../EntryTerm/entry-term";

interface DictionaryFlipCardProps {
  entry: IDictionaryEntryResponse;
  isFlipped: boolean;
  // The translation on the front
  reversed?: boolean;
  className?: string;
}

const faceStyle: CSSProperties = {
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
};

const CardFace: FC<{
  children: ReactNode;
  isBack?: boolean;
}> = ({ children, isBack }) => (
  <div
    style={isBack ? { ...faceStyle, transform: "rotateY(180deg)" } : faceStyle}
    className="absolute inset-0 flex flex-col rounded-2xl border-3 border-white dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 shadow-md p-6 overflow-hidden"
  >
    {children}
  </div>
);

// The word with how it sounds and its grammar
const TermSide: FC<{ entry: IDictionaryEntryResponse }> = ({ entry }) => (
  <>
    <p className="text-3xl md:text-4xl font-bold break-words max-w-full">
      <EntryTerm term={entry.term} article={entry.article} />
    </p>
    {entry.transcription && <p className="text-lg text-neutral-500">{entry.transcription}</p>}
    {entry.grammarInfo && <p className="text-sm text-neutral-500">{entry.grammarInfo}</p>}
  </>
);

// What comes with the answer: the example, synonyms and a note
const Extras: FC<{ entry: IDictionaryEntryResponse }> = ({ entry }) => (
  <>
    {entry.example && (
      <div className="flex flex-col w-full gap-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 p-3">
        <p className="italic">&ldquo;{entry.example}&rdquo;</p>
        {entry.exampleTranslation && <p className="text-sm text-neutral-500">{entry.exampleTranslation}</p>}
      </div>
    )}
    {entry.synonyms.length > 0 && (
      <div className="flex flex-wrap justify-center gap-2">
        {entry.synonyms.map((synonym) => (
          <span key={synonym} className="rounded-xl bg-neutral-200 dark:bg-neutral-700 px-2 py-0.5 text-xs">
            {synonym}
          </span>
        ))}
      </div>
    )}
    {entry.note && <p className="text-sm text-neutral-500">{entry.note}</p>}
  </>
);

// reversed: the translation first, the word to recall on the back
export const DictionaryFlipCard: FC<DictionaryFlipCardProps> = ({ entry, isFlipped, reversed = false, className }) => {
  const { t } = useTranslation();
  const label = (text: string) => <span className="text-xs uppercase tracking-wide text-neutral-400">{text}</span>;

  return (
    <div className={cn("relative w-full h-full", className)} style={{ perspective: 1200 }}>
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.87, 0, 0.13, 1] }}
      >
        <CardFace>
          <div className="flex justify-between items-center min-h-6">
            {reversed ? label(t("dictionary.translation")) : <span />}
            <PartOfSpeechBadge partOfSpeech={entry.partOfSpeech} />
          </div>
          <div className="flex flex-1 flex-col justify-center items-center gap-2 text-center min-h-0">
            {reversed ? (
              <p className="text-3xl md:text-4xl font-bold break-words max-w-full">{entry.translation}</p>
            ) : (
              <TermSide entry={entry} />
            )}
          </div>
          <div className="flex justify-center items-center gap-2 text-xs text-neutral-400">
            <LuRotateCcw />
            <span>{t("flashcards.tapToFlip")}</span>
          </div>
        </CardFace>

        <CardFace isBack>
          <div className="flex justify-between items-center min-h-6">
            {label(reversed ? t("dictionary.term") : t("dictionary.translation"))}
            <PartOfSpeechBadge partOfSpeech={entry.partOfSpeech} />
          </div>
          <div className="flex flex-1 flex-col justify-center items-center gap-4 text-center min-h-0 overflow-y-auto">
            {reversed ? (
              <div className="flex flex-col items-center gap-1">
                <TermSide entry={entry} />
              </div>
            ) : (
              <p className="text-3xl md:text-4xl font-bold break-words max-w-full">{entry.translation}</p>
            )}
            <Extras entry={entry} />
          </div>
        </CardFace>
      </motion.div>
    </div>
  );
};
