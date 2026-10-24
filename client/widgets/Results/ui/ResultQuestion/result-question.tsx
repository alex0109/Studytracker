import { FC, ReactNode } from "react";
import { LuCheck, LuLightbulb, LuSparkles, LuX } from "react-icons/lu";
import { IResultResponse } from "@/entities/attempt";
import { IOption, QuestionTypeEnum } from "@/entities/question";
import { cn } from "@/shared/lib";

interface ResultQuestionProps {
  index: number;
  title: string;
  questionType: QuestionTypeEnum;
  options?: IOption[];
  result?: IResultResponse;
}

type Status = "correct" | "partly" | "wrong" | "unanswered";

const STATUS_STYLES: Record<
  Status,
  { label: string; badge: string; card: string }
> = {
  correct: {
    label: "Correct",
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    card: "border-l-emerald-500",
  },
  partly: {
    label: "Partly correct",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    card: "border-l-amber-500",
  },
  wrong: {
    label: "Wrong",
    badge: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
    card: "border-l-red-500",
  },
  unanswered: {
    label: "Not answered",
    badge:
      "bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300",
    card: "border-l-neutral-300",
  },
};

const CONFIDENCE_LABELS: Record<string, string> = {
  Low: "Not sure",
  Medium: "Fairly sure",
  High: "Confident",
};

const AnswerBlock: FC<{
  label: string;
  tone: "good" | "bad" | "neutral";
  children: ReactNode;
}> = ({ label, tone, children }) => (
  <div
    className={cn(
      "flex flex-col gap-1 rounded-xl p-3",
      tone === "good" && "bg-emerald-50 dark:bg-emerald-950/40",
      tone === "bad" && "bg-red-50 dark:bg-red-950/40",
      tone === "neutral" && "bg-neutral-100 dark:bg-neutral-800",
    )}
  >
    <span
      className={cn(
        "text-xs font-semibold uppercase tracking-wide",
        tone === "good" && "text-emerald-700 dark:text-emerald-300",
        tone === "bad" && "text-red-700 dark:text-red-300",
        tone === "neutral" && "text-neutral-500",
      )}
    >
      {label}
    </span>
    <div className="whitespace-pre-line break-words">{children}</div>
  </div>
);

export const ResultQuestion: FC<ResultQuestionProps> = ({
  index,
  title,
  questionType,
  options = [],
  result,
}) => {
  const isChoice =
    questionType === QuestionTypeEnum.Options ||
    questionType === QuestionTypeEnum.TrueFalse;

  const status: Status = !result
    ? "unanswered"
    : result.isCorrect
      ? "correct"
      : isChoice && result.score > 0
        ? "partly"
        : "wrong";
  const styles = STATUS_STYLES[status];

  const chosen = new Set(result?.userAnswerOptionIds ?? []);
  const correct = new Set(
    result?.correctOptionIds?.length
      ? result.correctOptionIds
      : options.filter((o) => o.isCorrect).map((o) => o.id),
  );

  return (
    <article
      className={cn(
        "flex w-full flex-col gap-3 rounded-2xl border border-l-4 border-neutral-200 bg-white p-4 sm:p-5 dark:border-neutral-700 dark:bg-neutral-900",
        styles.card,
      )}
    >
      <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-bold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
            {index}
          </span>
          <h3 className="min-w-0 break-words text-lg font-semibold leading-snug">
            {title}
          </h3>
        </div>
        <div className="flex shrink-0 flex-wrap gap-1.5 pl-10 sm:pl-0">
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-semibold",
              styles.badge,
            )}
          >
            {status === "partly"
              ? `${styles.label} · ${Math.round(result!.score)}%`
              : styles.label}
          </span>
          {result?.method === "AI" && (
            <span
              title="Wording differed from the answer, AI checked the meaning"
              className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-950 dark:text-violet-300"
            >
              <LuSparkles /> Checked by AI
            </span>
          )}
        </div>
      </header>

      {isChoice ? (
        <ul className="flex flex-col gap-1.5">
          {options.map((option) => {
            const isChosen = chosen.has(option.id);
            const isRight = correct.has(option.id);

            return (
              <li
                key={option.id}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-sm",
                  isChosen &&
                    isRight &&
                    "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40",
                  isChosen &&
                    !isRight &&
                    "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/40",
                  !isChosen &&
                    isRight &&
                    "border-dashed border-emerald-400 dark:border-emerald-700",
                  !isChosen &&
                    !isRight &&
                    "border-neutral-200 text-neutral-500 dark:border-neutral-700",
                )}
              >
                <span className="flex min-w-0 items-center gap-2">
                  {isRight ? (
                    <LuCheck className="shrink-0 text-emerald-600" />
                  ) : isChosen ? (
                    <LuX className="shrink-0 text-red-600" />
                  ) : (
                    <span className="size-4 shrink-0" />
                  )}
                  <span className="break-words">{option.name}</span>
                </span>
                <span className="shrink-0 text-xs font-medium">
                  {isChosen ? (
                    <span
                      className={isRight ? "text-emerald-700" : "text-red-700"}
                    >
                      Your answer
                    </span>
                  ) : isRight ? (
                    <span className="text-emerald-700">Correct answer</span>
                  ) : null}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="grid gap-2 md:grid-cols-2">
          <AnswerBlock
            label="Your answer"
            tone={!result ? "neutral" : result.isCorrect ? "good" : "bad"}
          >
            {result?.userAnswer || (
              <span className="text-neutral-500">No answer</span>
            )}
          </AnswerBlock>
          {result?.correctAnswer && (
            <AnswerBlock label="Correct answer" tone="neutral">
              {result.correctAnswer}
            </AnswerBlock>
          )}
        </div>
      )}

      {result?.confidenceLevel && CONFIDENCE_LABELS[result.confidenceLevel] && (
        <p className="text-xs text-neutral-500">
          You felt: {CONFIDENCE_LABELS[result.confidenceLevel]}
        </p>
      )}

      {result && !result.isCorrect && result.questionExplanation && (
        <div className="flex gap-2 rounded-xl bg-amber-50 p-3 text-sm dark:bg-amber-950/30">
          <LuLightbulb className="mt-0.5 shrink-0 text-amber-600" />
          <p className="break-words">{result.questionExplanation}</p>
        </div>
      )}

      {result?.aiExplanation && (
        <div className="rounded-xl bg-violet-50 p-3 text-sm dark:bg-violet-950/40">
          <p className="mb-1 flex items-center gap-1 font-semibold text-violet-700 dark:text-violet-300">
            <LuSparkles /> Why
          </p>
          <p className="whitespace-pre-line break-words">
            {result.aiExplanation}
          </p>
        </div>
      )}
    </article>
  );
};
