"use client";

import { FC, useState } from "react";
import { LuCheck, LuEye, LuEyeOff, LuX } from "react-icons/lu";
import { ILibrarySnapshot } from "@/entities/library";
import { QuestionTypeEnum } from "@/entities/question/model";
import { isTrueFalseName, questionTypeKeys } from "@/entities/question";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";

export type LibraryQuestionData = ILibrarySnapshot["questions"][number];

interface LibraryQuestionProps {
  question: LibraryQuestionData;
  number: number;
  // Null: the answer is taken back. Nothing is saved, it only feeds the score on this page
  onAnswer: (correct: boolean | null) => void;
}

// A question to try right here: a click on an option shows how it went, and the answer opens on request
export const LibraryQuestion: FC<LibraryQuestionProps> = ({ question, number, onAnswer }) => {
  const { t } = useTranslation();
  const [revealed, setRevealed] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const hasOptions = question.questionType !== QuestionTypeEnum.Open && question.options.length > 0;

  const optionName = (name: string) =>
    isTrueFalseName(name) ? (name === "True" ? t("questions.true") : t("questions.false")) : name;

  const pick = (position: number, isCorrect: boolean) => {
    setPicked(position);
    setRevealed(true);
    onAnswer(isCorrect);
  };

  // Hiding the answer is also the way to try again
  const toggleAnswer = () => {
    if (revealed) {
      setPicked(null);
      onAnswer(null);
    }
    setRevealed(!revealed);
  };

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-mono text-neutral-400">{number}</span>
        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
          {t(`questions.types.${questionTypeKeys[question.questionType]}`)}
        </span>
      </div>

      <p className="font-serif text-lg leading-relaxed text-neutral-900 dark:text-neutral-50">{question.title}</p>

      {hasOptions && (
        <ul className="flex flex-col gap-1.5">
          {question.options.map((option) => {
            const correct = revealed && option.isCorrect;
            const wrong = picked === option.position && !option.isCorrect;
            return (
              <li key={option.position}>
                <button
                  type="button"
                  disabled={revealed}
                  onClick={() => pick(option.position, option.isCorrect)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-colors",
                    correct
                      ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200"
                      : wrong
                        ? "border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-200"
                        : "border-neutral-200 text-neutral-700 enabled:hover:border-emerald-300 enabled:hover:bg-emerald-50/50 dark:border-neutral-800 dark:text-neutral-300 dark:enabled:hover:border-emerald-800 dark:enabled:hover:bg-emerald-950/30",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-full border",
                      correct
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : wrong
                          ? "border-rose-600 bg-rose-600 text-white"
                          : "border-neutral-300 dark:border-neutral-600",
                    )}
                  >
                    {correct && <LuCheck className="size-3" />}
                    {wrong && <LuX className="size-3" />}
                  </span>
                  {optionName(option.name)}
                  {correct && <span className="sr-only">{t("library.reader.correct")}</span>}
                  {wrong && <span className="sr-only">{t("library.reader.wrong")}</span>}
                </button>
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
        onClick={toggleAnswer}
        className="flex items-center gap-1.5 self-start text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
      >
        {revealed ? <LuEyeOff aria-hidden /> : <LuEye aria-hidden />}
        {revealed ? t("library.reader.hideAnswer") : t("library.reader.showAnswer")}
      </button>
    </li>
  );
};
