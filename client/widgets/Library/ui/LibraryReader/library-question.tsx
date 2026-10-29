"use client";

import { FC, useState } from "react";
import { LuCheck, LuEye, LuEyeOff } from "react-icons/lu";
import { ILibrarySnapshot } from "@/entities/library";
import { QuestionTypeEnum } from "@/entities/question/model";
import { isTrueFalseName, questionTypeKeys } from "@/entities/question";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";

type Question = ILibrarySnapshot["questions"][number];

// A question to read, not to answer: the right answer opens on request
export const LibraryQuestion: FC<{ question: Question; number: number }> = ({ question, number }) => {
  const { t } = useTranslation();
  const [revealed, setRevealed] = useState(false);
  const hasOptions = question.questionType !== QuestionTypeEnum.Open && question.options.length > 0;
  const difficulty = question.questionDifficulty.toLowerCase() as "easy" | "medium" | "hard";

  const optionName = (name: string) =>
    isTrueFalseName(name) ? (name === "True" ? t("questions.true") : t("questions.false")) : name;

  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-mono text-neutral-400">{number}</span>
        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
          {t(`questions.types.${questionTypeKeys[question.questionType]}`)}
        </span>
        {["easy", "medium", "hard"].includes(difficulty) && (
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
            {t(`questions.difficulty.${difficulty}`)}
          </span>
        )}
      </div>

      <p className="font-serif text-lg leading-relaxed text-neutral-900 dark:text-neutral-50">{question.title}</p>

      {hasOptions && (
        <ul className="flex flex-col gap-1.5">
          {question.options.map((option) => {
            const correct = revealed && option.isCorrect;
            return (
              <li
                key={option.position}
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm",
                  correct
                    ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200"
                    : "border-neutral-200 text-neutral-700 dark:border-neutral-800 dark:text-neutral-300",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded-full border",
                    correct ? "border-emerald-600 bg-emerald-600 text-white" : "border-neutral-300 dark:border-neutral-600",
                  )}
                >
                  {correct && <LuCheck className="size-3" />}
                </span>
                {optionName(option.name)}
                {correct && <span className="sr-only">{t("library.reader.correct")}</span>}
              </li>
            );
          })}
        </ul>
      )}

      {revealed && !hasOptions && question.answer && (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100">
          <span className="font-medium">{t("library.reader.answer")}: </span>
          {question.answer}
        </div>
      )}

      {revealed && question.explanation && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          <span className="font-medium">{t("library.reader.explanation")}: </span>
          {question.explanation}
        </p>
      )}

      <button
        type="button"
        aria-expanded={revealed}
        onClick={() => setRevealed((value) => !value)}
        className="flex items-center gap-1.5 self-start text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
      >
        {revealed ? <LuEyeOff aria-hidden /> : <LuEye aria-hidden />}
        {revealed ? t("library.reader.hideAnswer") : t("library.reader.showAnswer")}
      </button>
    </li>
  );
};
