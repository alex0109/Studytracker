"use client";

import { FC } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { IconType } from "react-icons";
import { LuChevronDown, LuCircleHelp, LuListChecks, LuNotebookPen, LuToggleLeft } from "react-icons/lu";
import { cn } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";
import {
  IQuestionResponse,
  isTrueFalseName,
  QuestionDifficultyEnum,
  QuestionReviewBadge,
  QuestionTypeEnum,
  questionTypeKeys,
  toQuestionDifficulty,
} from "@/entities/question";
import {
  QuestionAnswerField,
  QuestionDifficultyField,
  QuestionExplanationField,
  QuestionOptionsField,
  QuestionTitleField,
  QuestionTrueFalseField,
} from "@/features/question/update-question";
import { DeleteQuestionButton } from "@/features/question/delete-question";

const TYPE_ICONS: Partial<Record<QuestionTypeEnum, IconType>> = {
  [QuestionTypeEnum.Open]: LuCircleHelp,
  [QuestionTypeEnum.Options]: LuListChecks,
  [QuestionTypeEnum.TrueFalse]: LuToggleLeft,
};

const DIFFICULTY_DOTS: Record<QuestionDifficultyEnum, string> = {
  [QuestionDifficultyEnum.Easy]: "bg-emerald-500",
  [QuestionDifficultyEnum.Medium]: "bg-amber-500",
  [QuestionDifficultyEnum.Hard]: "bg-rose-500",
};

interface QuestionCardProps {
  question: IQuestionResponse;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  // Shown on a material's list, where questions of its notes are mixed in
  showNoteMark?: boolean;
}

// Reads like a question when closed; opens into a small form where everything saves by itself
export const QuestionCard: FC<QuestionCardProps> = ({ question, index, isOpen, onToggle, showNoteMark }) => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const TypeIcon = TYPE_ICONS[question.questionType] ?? LuCircleHelp;
  const difficulty = toQuestionDifficulty(question.questionDifficulty);
  const isTrueFalse = question.questionType === QuestionTypeEnum.TrueFalse;

  // What the right answer is, in one line, so a closed card is useful too
  const answerPreview =
    question.questionType === QuestionTypeEnum.Open
      ? question.answer
      : question.options
          .filter((option) => option.isCorrect)
          .map((option) =>
            isTrueFalseName(option.name)
              ? t(option.name === "True" ? "questions.true" : "questions.false")
              : option.name,
          )
          .join(" · ");

  return (
    <li
      className={cn(
        "overflow-hidden rounded-2xl border bg-white transition-shadow dark:bg-neutral-900",
        isOpen
          ? "border-neutral-300 shadow-md dark:border-neutral-700"
          : "border-neutral-200 hover:shadow-sm dark:border-neutral-800",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`question-editor-${question.id}`}
        className="flex w-full items-start gap-3 p-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-400/60 sm:p-4"
      >
        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100 font-mono text-xs text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
          {index + 1}
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="line-clamp-2 font-medium text-neutral-900 break-words dark:text-neutral-50">{question.title}</span>
          {!isOpen && answerPreview && (
            <span className="truncate text-sm text-emerald-700 dark:text-emerald-400">→ {answerPreview}</span>
          )}
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="inline-flex items-center gap-1">
              <TypeIcon aria-hidden className="size-3.5" />
              {t(`questions.types.${questionTypeKeys[question.questionType]}`)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className={cn("size-1.5 rounded-full", DIFFICULTY_DOTS[difficulty])} aria-hidden />
              {t(`questions.difficulty.${difficulty}`)}
            </span>
            {showNoteMark && question.noteId && (
              <span className="inline-flex items-center gap-1">
                <LuNotebookPen aria-hidden className="size-3.5" /> {t("questions.editor.fromNote")}
              </span>
            )}
            <QuestionReviewBadge progress={question.progress} />
          </span>
        </span>
        <LuChevronDown
          aria-hidden
          className={cn("mt-1.5 size-4 shrink-0 text-neutral-400 transition-transform duration-200", isOpen && "rotate-180")}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`question-editor-${question.id}`}
            initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="flex flex-col gap-4 border-t border-neutral-100 bg-neutral-50/60 p-3 sm:p-4 dark:border-neutral-800 dark:bg-neutral-950/30">
              <QuestionTitleField
                materialId={question.materialId}
                id={question.id}
                title={question.title}
                isStatement={isTrueFalse}
              />
              {question.questionType === QuestionTypeEnum.Options ? (
                <QuestionOptionsField materialId={question.materialId} id={question.id} options={question.options} />
              ) : isTrueFalse ? (
                <QuestionTrueFalseField materialId={question.materialId} id={question.id} options={question.options} />
              ) : (
                <QuestionAnswerField materialId={question.materialId} id={question.id} answer={question.answer ?? ""} />
              )}
              <div className="grid gap-4 sm:grid-cols-[minmax(0,16rem)_1fr]">
                <QuestionDifficultyField
                  materialId={question.materialId}
                  id={question.id}
                  difficulty={difficulty}
                />
                <QuestionExplanationField
                  materialId={question.materialId}
                  id={question.id}
                  explanation={question.explanation}
                />
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-neutral-100 pt-3 dark:border-neutral-800">
                <span className="text-xs text-neutral-400">{t("questions.editor.autosave")}</span>
                <DeleteQuestionButton materialId={question.materialId} id={question.id} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};
