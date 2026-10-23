"use client";

import { CSSProperties, FC, ReactNode } from "react";
import { motion } from "framer-motion";
import { LuRotateCcw } from "react-icons/lu";
import { cn } from "@/shared/lib";
import { IDictionaryEntryResponse } from "../../model";
import { PartOfSpeechBadge } from "../PartOfSpeechBadge/part-of-speech-badge";

interface DictionaryFlipCardProps {
  entry: IDictionaryEntryResponse;
  isFlipped: boolean;
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
    className="absolute inset-0 flex flex-col rounded-2xl border-3 border-white dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900 shadow-md p-6 overflow-hidden"
  >
    {children}
  </div>
);

export const DictionaryFlipCard: FC<DictionaryFlipCardProps> = ({
  entry,
  isFlipped,
  className,
}) => {
  return (
    <div
      className={cn("relative w-full h-full", className)}
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.87, 0, 0.13, 1] }}
      >
        <CardFace>
          <div className="flex justify-between items-center min-h-6">
            <PartOfSpeechBadge partOfSpeech={entry.partOfSpeech} />
          </div>
          <div className="flex flex-1 flex-col justify-center items-center gap-2 text-center min-h-0">
            <p className="text-3xl md:text-4xl font-bold break-words max-w-full">
              {entry.term}
            </p>
            {entry.transcription && (
              <p className="text-lg text-neutral-500">{entry.transcription}</p>
            )}
            {entry.grammarInfo && (
              <p className="text-sm text-neutral-500">{entry.grammarInfo}</p>
            )}
          </div>
          <div className="flex justify-center items-center gap-2 text-xs text-neutral-400">
            <LuRotateCcw />
            <span>Tap to see translation</span>
          </div>
        </CardFace>

        <CardFace isBack>
          <div className="flex justify-between items-center min-h-6">
            <span className="text-xs uppercase tracking-wide text-neutral-400">
              Translation
            </span>
            <PartOfSpeechBadge partOfSpeech={entry.partOfSpeech} />
          </div>
          <div className="flex flex-1 flex-col justify-center items-center gap-4 text-center min-h-0 overflow-y-auto">
            <p className="text-3xl md:text-4xl font-bold break-words max-w-full">
              {entry.translation}
            </p>
            {entry.example && (
              <div className="flex flex-col w-full gap-1 rounded-xl bg-gray-100 dark:bg-neutral-800 p-3">
                <p className="italic">&ldquo;{entry.example}&rdquo;</p>
                {entry.exampleTranslation && (
                  <p className="text-sm text-neutral-500">
                    {entry.exampleTranslation}
                  </p>
                )}
              </div>
            )}
            {entry.synonyms.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {entry.synonyms.map((synonym) => (
                  <span
                    key={synonym}
                    className="rounded-xl bg-neutral-200 dark:bg-neutral-700 px-2 py-0.5 text-xs"
                  >
                    {synonym}
                  </span>
                ))}
              </div>
            )}
            {entry.note && (
              <p className="text-sm text-neutral-500">{entry.note}</p>
            )}
          </div>
        </CardFace>
      </motion.div>
    </div>
  );
};
