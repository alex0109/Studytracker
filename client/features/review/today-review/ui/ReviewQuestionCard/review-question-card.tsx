"use client";

import { FC, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuArrowRight, LuCheck, LuCircleCheck, LuCircleX, LuX } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { TextArea } from "@/shared/ui";
import { cn } from "@/shared/lib/cn";
import { useTranslation } from "@/shared/i18n";
import { isTrueFalseName, QuestionTypeEnum } from "@/entities/question";
import { IConfidenceLevel } from "@/entities/attempt/model/confidence-level";
import type { IReviewAnswerResult, IReviewQuestion } from "@/entities/review";
import { useReviewAnswer } from "../../hooks/useTodayReview";

interface ReviewQuestionCardProps {
  sessionId: string;
  question: IReviewQuestion;
  index: number;
  total: number;
  isLast: boolean;
  onNext: (result: IReviewAnswerResult) => void;
}

const CONFIDENCE_OPTIONS = [
  { value: IConfidenceLevel.Low, key: "low" },
  { value: IConfidenceLevel.Medium, key: "medium" },
  { value: IConfidenceLevel.High, key: "high" },
] as const;

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

const when = (due: string, language: string) => {
  const format = new Intl.RelativeTimeFormat(language, { numeric: "auto" });
  const diff = new Date(due).getTime() - Date.now();

  return diff < DAY
    ? format.format(Math.max(1, Math.round(diff / HOUR)), "hour")
    : format.format(Math.round(diff / DAY), "day");
};

// One question of the "Today" queue: answered once, then checked right away with the right
// answer shown. Unlike an attempt there is nothing to change later, it is a review
export const ReviewQuestionCard: FC<ReviewQuestionCardProps> = ({
  sessionId,
  question,
  index,
  total,
  isLast,
  onNext,
}) => {
  const { t, i18n } = useTranslation();
  const isTrueFalse = question.questionType === QuestionTypeEnum.TrueFalse;
  const isChoice = question.questionType === QuestionTypeEnum.Options || isTrueFalse;

  const [selected, setSelected] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [confidence, setConfidence] = useState<IConfidenceLevel>();
  const [error, setError] = useState<string>();
  const [result, setResult] = useState<IReviewAnswerResult>();

  const { submitAnswer, submitAnswerIsPending } = useReviewAnswer(sessionId);

  const optionName = (name: string) =>
    isTrueFalseName(name) ? t(name === "True" ? "questions.true" : "questions.false") : name;

  const onSelect = (optionId: string) => {
    if (result) return;
    setError(undefined);
    setSelected((prev) =>
      isTrueFalse || !isChoice
        ? [optionId]
        : prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId],
    );
  };

  const onCheck = async () => {
    if (isChoice && selected.length === 0) return setError(t("attempt.errors.choose"));
    if (!isChoice && !text.trim()) return setError(t("attempt.errors.write"));

    try {
      const answer = await submitAnswer(
        isChoice
          ? { questionId: question.id, userAnswerOptionIds: selected, confidenceLevel: confidence }
          : { questionId: question.id, userAnswer: text.trim(), confidenceLevel: confidence },
      );
      setResult(answer);
    } catch {
      // The hook already told the user
    }
  };

  const correctIds = result?.correctOptionIds ?? [];

  return (
    <motion.section
      key={question.id}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.22 }}
      className={cn(
        "flex w-full max-w-2xl flex-col gap-4 rounded-2xl border bg-white p-4 sm:p-6 dark:bg-neutral-900",
        result
          ? result.isCorrect
            ? "border-emerald-300 dark:border-emerald-800"
            : "border-rose-300 dark:border-rose-900"
          : "border-neutral-200 dark:border-neutral-700",
      )}
    >
      <header className="flex flex-col gap-1">
        <span className="text-xs font-medium text-neutral-500">
          {t("today.question.of", { index, total })} · {question.materialTitle}
        </span>
        <h3 className="break-words text-lg font-semibold leading-snug sm:text-xl">{question.title}</h3>
      </header>

      {isChoice ? (
        <div className={cn("flex gap-2", isTrueFalse ? "flex-wrap" : "flex-col")}>
          {question.options.map((option) => {
            const isSelected = selected.includes(option.id);
            const isRight = result && correctIds.includes(option.id);
            const isWrongPick = result && isSelected && !isRight;

            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={isSelected}
                disabled={!!result}
                onClick={() => onSelect(option.id)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition-colors",
                  isTrueFalse && "rounded-full px-5",
                  isRight
                    ? "border-emerald-600 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-100"
                    : isWrongPick
                      ? "border-rose-500 bg-rose-50 text-rose-950 dark:bg-rose-950/40 dark:text-rose-100"
                      : isSelected
                        ? "border-neutral-900 bg-neutral-50 dark:border-neutral-200 dark:bg-neutral-800"
                        : "border-neutral-200 bg-white hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-800",
                )}
              >
                {isRight ? <LuCheck aria-hidden /> : isWrongPick ? <LuX aria-hidden /> : null}
                <span className="break-words">{optionName(option.name)}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <TextArea
          value={text}
          disabled={!!result}
          onChange={(e) => {
            setError(undefined);
            setText(e.target.value);
          }}
          placeholder={t("attempt.answerPlaceholder")}
          aria-label={t("attempt.answerLabel")}
          inputStyles="h-32 w-full bg-neutral-100 p-4 dark:bg-neutral-800"
          maxLength={1000}
        />
      )}

      {!result && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-neutral-500">{t("attempt.confidenceShort")}</span>
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
          <Button size="lg" onClick={onCheck} disabled={submitAnswerIsPending} className="w-full sm:w-auto">
            {submitAnswerIsPending ? t("attempt.checking") : t("today.question.check")}
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex flex-col gap-2 rounded-xl p-3",
              result.isCorrect ? "bg-emerald-50 dark:bg-emerald-950/40" : "bg-rose-50 dark:bg-rose-950/40",
            )}
          >
            <p
              className={cn(
                "flex items-center gap-1.5 font-semibold",
                result.isCorrect ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300",
              )}
            >
              <motion.span
                initial={{ scale: 0.4, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 18 }}
                className="inline-flex"
              >
                {result.isCorrect ? <LuCircleCheck aria-hidden /> : <LuCircleX aria-hidden />}
              </motion.span>
              {result.isCorrect ? t("today.question.correct") : t("today.question.incorrect")}
            </p>
            {!isChoice && result.correctAnswer && !result.isCorrect && (
              <p className="whitespace-pre-line break-words border-l-2 border-emerald-400 pl-3 text-sm text-neutral-700 dark:text-neutral-200">
                <span className="font-medium">{t("today.question.correctAnswer")}: </span>
                {result.correctAnswer}
              </p>
            )}
            {result.explanation && (
              <p className="text-sm text-neutral-600 dark:text-neutral-300">{result.explanation}</p>
            )}
            <p className="text-xs text-neutral-500">
              {result.isCorrect
                ? t("today.question.nextReview", { when: when(result.nextDue, i18n.language) })
                : t("today.question.again")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {result && (
        <Button size="lg" onClick={() => onNext(result)} className="self-end">
          {isLast ? t("today.question.finish") : t("today.question.next")} <LuArrowRight aria-hidden />
        </Button>
      )}
    </motion.section>
  );
};
