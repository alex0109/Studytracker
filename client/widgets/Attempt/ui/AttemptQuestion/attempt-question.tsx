"use client";

import { FC, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LuCheck, LuCircleCheck, LuX } from "react-icons/lu";
import { TextArea } from "@/shared/ui";
import { Button } from "@/shared/radix-ui";
import { cn } from "@/shared/lib";
import { useAttemptSubmitAnswer } from "@/features/attempt/submit-answer";
import { IOption, QuestionTypeEnum } from "@/entities/question";
import { IConfidenceLevel } from "@/entities/attempt/model/confidence-level";
import { ISavedAnswer } from "../../model/saved-answer.type";
import { useTranslation } from "@/shared/i18n";
import { isTrueFalseName } from "@/entities/question";

interface AttemptQuestionProps {
  questionId: string;
  attemptId: string;
  index: number;
  title: string;
  questionType: QuestionTypeEnum;
  options?: IOption[];
  savedAnswer?: ISavedAnswer;
  // Finish was pressed while this question had no answer
  isMissing: boolean;
  onAnswered: (answer: ISavedAnswer) => void;
}

// Labels are translation keys under "attempt.confidence"
const CONFIDENCE_OPTIONS = [
  { value: IConfidenceLevel.Low, key: "low" },
  { value: IConfidenceLevel.Medium, key: "medium" },
  { value: IConfidenceLevel.High, key: "high" },
] as const;

const TYPE_HINTS = {
  [QuestionTypeEnum.Open]: "attempt.hints.open",
  [QuestionTypeEnum.Options]: "attempt.chooseAll",
  [QuestionTypeEnum.TrueFalse]: "attempt.hints.trueFalse",
  [QuestionTypeEnum.Flashcard]: "attempt.hints.open",
} as const;

export const AttemptQuestion: FC<AttemptQuestionProps> = ({
  questionId,
  attemptId,
  index,
  title,
  questionType,
  options = [],
  savedAnswer,
  isMissing,
  onAnswered,
}) => {
  const { t } = useTranslation();
  const isTrueFalse = questionType === QuestionTypeEnum.TrueFalse;
  const isChoice = questionType === QuestionTypeEnum.Options || isTrueFalse;

  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [confidence, setConfidence] = useState<IConfidenceLevel>();
  const [error, setError] = useState<string>();

  const { submitAnswer, submitAnswerIsPending } =
    useAttemptSubmitAnswer(attemptId);

  // An answer saved before a reload is shown and can be changed
  useEffect(() => {
    if (!savedAnswer) return;
    setSelectedOptionIds((prev) =>
      prev.length ? prev : savedAnswer.optionIds,
    );
    setText((prev) => prev || savedAnswer.text || "");
  }, [savedAnswer]);

  const onSelectOption = (optionId: string) => {
    setError(undefined);

    if (!isChoice || isTrueFalse) {
      setSelectedOptionIds([optionId]);
      return;
    }

    setSelectedOptionIds((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId],
    );
  };

  const onSubmit = async () => {
    if (isChoice && selectedOptionIds.length === 0) {
      setError(t("attempt.errors.choose"));
      return;
    }

    if (!isChoice && !text.trim()) {
      setError(t("attempt.errors.write"));
      return;
    }

    setError(undefined);

    try {
      await submitAnswer(
        isChoice
          ? {
              questionId,
              userAnswerOptionIds: selectedOptionIds,
              confidenceLevel: confidence,
            }
          : {
              questionId,
              userAnswer: text.trim(),
              confidenceLevel: confidence,
            },
      );

      onAnswered({
        text: isChoice ? undefined : text.trim(),
        optionIds: isChoice ? selectedOptionIds : [],
        changes: savedAnswer ? savedAnswer.changes + 1 : 0,
      });
    } catch {
      // The hook already tells the user
    }
  };

  const savedOptionNames = options
    .filter((option) => savedAnswer?.optionIds.includes(option.id))
    .map((option) =>
      isTrueFalseName(option.name)
        ? t(option.name === "True" ? "questions.true" : "questions.false")
        : option.name,
    );

  return (
    <motion.section
      id={`question-${questionId}`}
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "flex w-full scroll-mt-28 flex-col gap-4 rounded-2xl border bg-white p-4 sm:p-5 dark:bg-neutral-900",
        isMissing
          ? "border-red-400 ring-2 ring-red-200 dark:ring-red-900"
          : savedAnswer
            ? "border-emerald-300 dark:border-emerald-800"
            : "border-neutral-200 dark:border-neutral-700",
      )}
    >
      <header className="flex items-start gap-3">
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
            savedAnswer
              ? "bg-emerald-600 text-white"
              : "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-100",
          )}
        >
          {savedAnswer ? <LuCheck /> : index}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3 className="break-words text-lg font-semibold leading-snug">
            {title}
          </h3>
          <span className="text-sm text-neutral-500">
            {t(TYPE_HINTS[questionType])}
          </span>
        </div>
      </header>

      {isTrueFalse ? (
        <div className="flex flex-wrap gap-2">
          {options.map((option) => {
            const isTrue = option.name.toLowerCase() === "true";
            const isSelected = selectedOptionIds.includes(option.id);

            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelectOption(option.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border-2 px-5 py-2 text-sm font-semibold transition-colors",
                  isSelected
                    ? isTrue
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-rose-600 bg-rose-600 text-white"
                    : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200",
                )}
              >
                {isTrue ? <LuCheck /> : <LuX />}
                {isTrueFalseName(option.name)
                  ? t(isTrue ? "questions.true" : "questions.false")
                  : option.name}
              </button>
            );
          })}
        </div>
      ) : isChoice ? (
        <div className="flex flex-col gap-2">
          {options.map((option, optionIndex) => {
            const isSelected = selectedOptionIds.includes(option.id);

            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelectOption(option.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition-colors",
                  isSelected
                    ? "border-emerald-600 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-100"
                    : "border-neutral-200 bg-white hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-800",
                )}
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-bold",
                    isSelected
                      ? "bg-emerald-600 text-white"
                      : "bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-200",
                  )}
                >
                  {isSelected ? (
                    <LuCheck />
                  ) : (
                    String.fromCharCode(65 + optionIndex)
                  )}
                </span>
                <span className="break-words">{option.name}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <TextArea
          value={text}
          onChange={(e) => {
            setError(undefined);
            setText(e.target.value);
          }}
          placeholder={t("attempt.answerPlaceholder")}
          aria-label={t("attempt.answerLabel")}
          inputStyles="h-40 w-full bg-neutral-100 p-4 dark:bg-neutral-800"
          maxLength={1000}
        />
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-neutral-500">
            {t("attempt.confidenceShort")}
          </span>
          <div className="inline-flex w-fit rounded-full bg-neutral-100 p-1 dark:bg-neutral-800">
            {CONFIDENCE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={confidence === option.value}
                onClick={() => setConfidence(option.value)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  confidence === option.value
                    ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-600 dark:text-white"
                    : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200",
                )}
              >
                {t(`attempt.confidence.${option.key}`)}
              </button>
            ))}
          </div>
        </div>

        <Button
          size="lg"
          onClick={onSubmit}
          disabled={submitAnswerIsPending}
          className="w-full bg-emerald-700 hover:bg-emerald-800 sm:w-auto"
        >
          {submitAnswerIsPending
            ? isChoice
              ? t("attempt.saving")
              : t("attempt.checking")
            : savedAnswer
              ? t("attempt.update")
              : t("attempt.save")}
        </Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {savedAnswer && (
        <div className="flex flex-col gap-2 rounded-xl bg-emerald-50 p-3 dark:bg-emerald-950/40">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            <LuCircleCheck /> {t("attempt.saved")}
            {savedAnswer.changes > 0 && (
              <span className="font-normal text-emerald-700/70 dark:text-emerald-300/70">
                · {t("attempt.changed", { count: savedAnswer.changes })}
              </span>
            )}
          </p>
          {isChoice ? (
            <div className="flex flex-wrap gap-1.5">
              {savedOptionNames.map((name) => (
                <span
                  key={name}
                  className="rounded-full bg-white px-3 py-1 text-sm text-emerald-900 dark:bg-emerald-900 dark:text-emerald-50"
                >
                  {name}
                </span>
              ))}
            </div>
          ) : (
            <p className="whitespace-pre-line break-words border-l-2 border-emerald-400 pl-3 text-sm text-neutral-700 dark:text-neutral-200">
              {savedAnswer.text}
            </p>
          )}
          <p className="text-xs text-neutral-500">
            {t("attempt.canChange")}
          </p>
        </div>
      )}
    </motion.section>
  );
};
