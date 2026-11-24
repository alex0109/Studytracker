"use client";

import { FC, useState, useRef } from "react";
import { motion } from "framer-motion";
import { LuCheck, LuCircleCheck } from "react-icons/lu";
import { TextArea, VoiceField } from "@/shared/ui";
import { Button } from "@/shared/radix-ui";
import { cn } from "@/shared/lib";
import { useAttemptSubmitAnswer } from "@/features/attempt/submit-answer";
import { IOption, QuestionTypeEnum, isTrueFalseName } from "@/entities/question";
import { ConfidencePicker, IConfidenceLevel, HesitationMark } from "@/entities/attempt";
import { ISavedAnswer } from "../../model/saved-answer.type";
import { AnswerChoices } from "./answer-choices";
import { useTranslation } from "@/shared/i18n";

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
  // Changes of mind since the last save. Options the user took back are remembered, so going back
  // and forth between them counts each time, while simply ticking several correct ones doesn't
  const [changes, setChanges] = useState(0);
  const removedOptions = useRef(new Set<string>());

  const { submitAnswer, submitAnswerIsPending } =
    useAttemptSubmitAnswer(attemptId);

  // An answer saved before a reload is shown and can be changed
  const [shownSavedAnswer, setShownSavedAnswer] = useState<typeof savedAnswer>();
  if (savedAnswer && savedAnswer !== shownSavedAnswer) {
    setShownSavedAnswer(savedAnswer);
    setSelectedOptionIds((prev) =>
      prev.length ? prev : savedAnswer.optionIds,
    );
    setText((prev) => prev || savedAnswer.text || "");
  }

  const onSelectOption = (optionId: string) => {
    setError(undefined);

    if (!isChoice || isTrueFalse) {
      if (selectedOptionIds.length > 0 && !selectedOptionIds.includes(optionId)) {
        setChanges((prev) => prev + 1);
      }
      setSelectedOptionIds([optionId]);
      return;
    }

    if (selectedOptionIds.includes(optionId)) {
      removedOptions.current.add(optionId);
      setChanges((prev) => prev + 1);
      setSelectedOptionIds(selectedOptionIds.filter((id) => id !== optionId));
      return;
    }

    if (removedOptions.current.has(optionId)) setChanges((prev) => prev + 1);
    setSelectedOptionIds([...selectedOptionIds, optionId]);
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
              answerChanges: changes,
            }
          : {
              questionId,
              userAnswer: text.trim(),
              confidenceLevel: confidence,
            },
      );

      // Counted like the server: saving the same answer again is not a change
      const isSameAnswer =
        !!savedAnswer &&
        (isChoice
          ? savedAnswer.optionIds.length === selectedOptionIds.length &&
            savedAnswer.optionIds.every((id) => selectedOptionIds.includes(id))
          : savedAnswer.text === text.trim());

      onAnswered({
        text: isChoice ? undefined : text.trim(),
        optionIds: isChoice ? selectedOptionIds : [],
        changes: savedAnswer
          ? savedAnswer.changes + Math.max(isSameAnswer ? 0 : 1, changes)
          : changes,
      });
      setChanges(0);
      removedOptions.current.clear();
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
        {isChoice && <HesitationMark changes={(savedAnswer?.changes ?? 0) + changes} />}
      </header>

      {isChoice ? (
        <AnswerChoices
          options={options}
          isTrueFalse={isTrueFalse}
          selectedIds={selectedOptionIds}
          onSelect={onSelectOption}
        />
      ) : (
        <VoiceField
          value={text}
          maxLength={1000}
          className="-mt-5"
          onChange={(next) => {
            setError(undefined);
            setText(next);
          }}
        >
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
        </VoiceField>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <ConfidencePicker value={confidence} onChange={setConfidence} />

        <Button
          size="lg"
          onClick={onSubmit}
          disabled={submitAnswerIsPending}
          className="w-full bg-emerald-700 text-white hover:bg-emerald-800 sm:w-auto"
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
            {!isChoice && savedAnswer.changes > 0 && (
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
