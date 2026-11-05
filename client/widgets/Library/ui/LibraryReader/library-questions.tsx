"use client";

import { FC, useState } from "react";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { LibraryDisclosure } from "./library-disclosure";
import { LibraryQuestion, LibraryQuestionData } from "./library-question";

const LEVELS = ["easy", "medium", "hard"] as const;
type Level = (typeof LEVELS)[number];

const LEVEL_DOTS: Record<Level, string> = {
  easy: "bg-emerald-500",
  medium: "bg-amber-500",
  hard: "bg-rose-500",
};

// A level this page doesn't know still lands in a group: no question may go missing
const levelOf = (question: LibraryQuestionData): Level => {
  const level = question.questionDifficulty.toLowerCase() as Level;
  return LEVELS.includes(level) ? level : "medium";
};

export const questionLevels = (questions: LibraryQuestionData[]) =>
  LEVELS.map((level) => ({
    level,
    id: `questions-${level}`,
    items: questions.map((question, index) => ({ question, number: index + 1 })).filter((item) => levelOf(item.question) === level),
  })).filter((group) => group.items.length > 0);

export const LibraryQuestions: FC<{ questions: LibraryQuestionData[] }> = ({ questions }) => {
  const { t } = useTranslation();
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const answered = Object.values(answers);

  const remember = (number: number, correct: boolean | null) =>
    setAnswers((current) => {
      const next = { ...current };
      if (correct === null) delete next[number];
      else next[number] = correct;
      return next;
    });

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="min-w-0 flex-1 basis-64 text-sm text-neutral-600 dark:text-neutral-400">{t("library.reader.demo")}</p>
        {answered.length > 0 && (
          <span
            role="status"
            className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
          >
            {t("library.reader.score", { correct: answered.filter(Boolean).length, total: answered.length })}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {questionLevels(questions).map(({ level, id, items }) => (
          <LibraryDisclosure
            key={level}
            id={id}
            summary={
              <>
                <span aria-hidden className={cn("size-2.5 shrink-0 rounded-full", LEVEL_DOTS[level])} />
                <h3 className="font-sans text-lg font-semibold text-neutral-800 dark:text-neutral-100">
                  {t(`library.reader.levels.${level}`)}
                </h3>
                <span className="text-sm text-neutral-500">{t("library.counts.questions", { count: items.length })}</span>
              </>
            }
          >
            <ol className="flex flex-col gap-3">
              {items.map(({ question, number }) => (
                <LibraryQuestion
                  key={number}
                  question={question}
                  number={number}
                  onAnswer={(correct) => remember(number, correct)}
                />
              ))}
            </ol>
          </LibraryDisclosure>
        ))}
      </div>
    </>
  );
};
