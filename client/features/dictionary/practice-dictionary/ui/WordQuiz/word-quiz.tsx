"use client";

import { FC, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LuArrowRight, LuCheck, LuSparkles, LuX } from "react-icons/lu";
import { EntryTerm, IDictionaryEntryResponse, IWordQuizOption } from "@/entities/dictionary";
import { Button, Skeleton } from "@/shared/radix-ui";
import { useLatest } from "@/shared/hooks";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { useWordQuiz } from "../../hooks/useWordQuiz";

interface WordQuizProps {
  // The word that was just forgotten
  entry: IDictionaryEntryResponse;
  // Answered right, or there is nothing to ask: the next word may come
  onDone: () => void;
}

const PROMPT_KEYS = {
  Translation: "flashcards.quiz.pickTranslation",
  Synonym: "flashcards.quiz.pickSynonym",
} as const;

const optionStyle = (isWrong: boolean, isRight: boolean, isSolved: boolean) =>
  cn(
    "flex w-full min-w-0 items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left text-sm font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:cursor-default",
    isRight
      ? "border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100"
      : isWrong
        ? "border-red-400 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
        : isSolved
          ? "border-neutral-200 text-neutral-400 dark:border-neutral-800 dark:text-neutral-500"
          : "border-neutral-200 bg-white hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-800",
  );

// Comes right after "don't know" or "not sure": the word stays until the right choice is found.
// A wrong choice is marked and can't be picked again, the right one isn't given away
export const WordQuiz: FC<WordQuizProps> = ({ entry, onDone }) => {
  const { t } = useTranslation();
  const { quizData, quizError } = useWordQuiz(entry.id);
  const [wrong, setWrong] = useState<string[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const done = useLatest(onDone);

  const options = quizData?.options ?? [];
  // Too few words to choose from, or no answer from the server: the word isn't held back
  const nothingToAsk = !!quizError || (!!quizData && options.length < 2);

  useEffect(() => {
    if (nothingToAsk) done.current();
  }, [nothingToAsk, done]);

  const pick = (option: IWordQuizOption) => {
    if (isSolved || wrong.includes(option.text)) return;

    if (option.isCorrect) setIsSolved(true);
    else setWrong((prev) => [...prev, option.text]);
  };

  // 1–4 pick a choice; once it's solved the focused Next button takes Enter
  const keys = useLatest({ options, isSolved, pick });
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const { options: shown, isSolved: solved, pick: choose } = keys.current;
      const number = Number.parseInt(event.key, 10);

      if (!solved && number >= 1 && number <= shown.length) {
        event.preventDefault();
        choose(shown[number - 1]);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [keys]);

  if (!quizData || nothingToAsk) {
    return (
      <div className="absolute inset-0 flex flex-col gap-3 rounded-2xl border-3 border-white bg-neutral-50 p-6 shadow-md dark:border-neutral-800 dark:bg-neutral-900">
        <Skeleton className="h-5 w-32 rounded-full" />
        <Skeleton className="mx-auto mt-4 h-9 w-40" />
        <div className="mt-auto grid gap-2 sm:grid-cols-2">
          {[0, 1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-11 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      aria-labelledby={`quiz-${entry.id}`}
      className="absolute inset-0 flex flex-col gap-4 overflow-y-auto rounded-2xl border-3 border-white bg-neutral-50 p-5 shadow-md md:p-6 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-violet-100 px-2.5 py-1 text-xs font-medium text-violet-700 dark:bg-violet-950 dark:text-violet-300">
        <LuSparkles aria-hidden /> {t("flashcards.quiz.badge")}
      </span>

      <div className="flex flex-col items-center gap-1 text-center">
        <span id={`quiz-${entry.id}`} className="text-sm text-neutral-500">
          {t(PROMPT_KEYS[quizData.kind])}
        </span>
        <EntryTerm term={quizData.term} article={quizData.article} className="text-2xl font-bold break-words md:text-3xl" />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option, index) => {
          const isWrong = wrong.includes(option.text);
          const isRight = isSolved && option.isCorrect;

          return (
            <button
              key={option.text}
              type="button"
              disabled={isSolved || isWrong}
              aria-pressed={isWrong || isRight}
              onClick={() => pick(option)}
              className={optionStyle(isWrong, isRight, isSolved)}
            >
              <span
                aria-hidden
                className="flex size-6 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-xs font-bold text-neutral-500 dark:bg-neutral-700 dark:text-neutral-200"
              >
                {isRight ? <LuCheck /> : isWrong ? <LuX /> : index + 1}
              </span>
              <span className="min-w-0 break-words">{option.text}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto flex min-h-10 items-center justify-between gap-3">
        <p aria-live="polite" className={cn("text-sm font-medium", isSolved ? "text-emerald-600" : "text-red-500")}>
          {isSolved ? t("flashcards.quiz.right") : wrong.length > 0 ? t("flashcards.quiz.wrong") : ""}
        </p>
        {isSolved && (
          <Button autoFocus onClick={onDone} className="bg-emerald-600 text-white hover:bg-emerald-700">
            {t("flashcards.quiz.next")} <LuArrowRight aria-hidden />
          </Button>
        )}
      </div>
    </motion.section>
  );
};
