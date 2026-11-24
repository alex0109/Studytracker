"use client";

import { FC, useEffect, useRef } from "react";
import { LuCircleCheck, LuFileCheck, LuSpellCheck, LuTarget, LuTextQuote, LuWorkflow } from "react-icons/lu";
import type { IconType } from "react-icons";
import { RichTextDocument } from "@/shared/types";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { EssayTask, NoteText } from "@/features/note/update-note";
import { ReviewEssayButton } from "@/features/note/review-essay";
import {
  countDocumentWords,
  ESSAY_EXAMS,
  ESSAY_MIN_WORDS,
  EssayCriterion,
  essayFormatMinWords,
  EssayReviewCard,
  parseEssayFormat,
  useNoteExact,
} from "@/entities/note";

const CRITERIA: { criterion: EssayCriterion; icon: IconType }[] = [
  { criterion: "TaskResponse", icon: LuTarget },
  { criterion: "Coherence", icon: LuWorkflow },
  { criterion: "Vocabulary", icon: LuTextQuote },
  { criterion: "Grammar", icon: LuSpellCheck },
];

interface EssayNoteProps {
  materialId: string;
  noteId: string;
  textContent?: RichTextDocument;
}

// The task on top, the text, then one bar with the words written and the check, and the result under it
export const EssayNote: FC<EssayNoteProps> = ({ materialId, noteId, textContent }) => {
  const { t } = useTranslation();
  // Refreshed after every autosave, so the word count and the review follow the saved note
  const { exactNoteData } = useNoteExact(materialId, noteId);
  const review = exactNoteData?.essayReview ?? null;
  const wordCount = countDocumentWords(exactNoteData?.textContent ?? textContent);
  const format = parseEssayFormat(exactNoteData?.essayFormat);

  // The bar fills towards the exam's minimum, or the minimum the check needs
  const examMinimum = essayFormatMinWords(format);
  const target = examMinimum ?? ESSAY_MIN_WORDS;
  const progress = Math.min(1, wordCount / target);
  const reached = wordCount >= target;

  // A new check scrolls to its result; the one shown on opening stays where it is
  const resultRef = useRef<HTMLDivElement>(null);
  const shownCheck = useRef(review?.checkedAt);
  useEffect(() => {
    if (!review || review.checkedAt === shownCheck.current) return;
    shownCheck.current = review.checkedAt;
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [review]);

  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      <EssayTask
        materialId={materialId}
        noteId={noteId}
        task={exactNoteData?.essayTask}
        format={exactNoteData?.essayFormat}
      />

      <NoteText materialId={materialId} propNoteId={noteId} textContent={textContent} />

      <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white/80 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5 dark:border-neutral-800 dark:bg-neutral-900/80">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-baseline justify-between gap-3">
            <p className="flex items-baseline gap-1.5">
              <span className="text-2xl font-semibold tabular-nums">{wordCount}</span>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                {examMinimum
                  ? t("notes.essay.ofWords", { count: examMinimum })
                  : t("notes.essay.wordsLabel", { count: wordCount })}
              </span>
            </p>
            {reached && examMinimum && (
              <span className="flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <LuCircleCheck aria-hidden /> {t("notes.essay.minimumReached")}
              </span>
            )}
          </div>
          <div
            className="h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={target}
            aria-valuenow={Math.min(wordCount, target)}
            aria-label={t("notes.essay.wordsProgress")}
          >
            <div
              className={cn("h-full rounded-full transition-[width] duration-500", reached ? "bg-emerald-500" : "bg-orange-400")}
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          {examMinimum && format && !reached && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {t("notes.essay.examMinimum", { exam: ESSAY_EXAMS[format.exam].short, count: examMinimum })}
            </p>
          )}
        </div>
        <ReviewEssayButton
          materialId={materialId}
          noteId={noteId}
          wordCount={wordCount}
          hasReview={!!review}
          className="sm:items-end"
        />
      </div>

      <div ref={resultRef} className="scroll-mt-24">
        {review ? (
          <EssayReviewCard review={review} />
        ) : (
          <div className="flex flex-col gap-4 rounded-3xl border border-dashed border-neutral-300 p-5 sm:p-6 dark:border-neutral-700">
            <div className="flex flex-col gap-1">
              <p className="flex items-center gap-2 font-semibold">
                <LuFileCheck className="text-violet-600 dark:text-violet-400" aria-hidden />
                {t("notes.essay.empty.title")}
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {format
                  ? t("notes.essay.empty.textExam", { exam: ESSAY_EXAMS[format.exam].name })
                  : t("notes.essay.empty.text")}
              </p>
            </div>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {CRITERIA.map(({ criterion, icon: Icon }) => (
                <li
                  key={criterion}
                  className="flex items-center gap-2 rounded-xl bg-neutral-100 px-3 py-2.5 text-sm font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                >
                  <Icon aria-hidden className="shrink-0 text-violet-500" />
                  {t(`notes.essay.criteria.${criterion}`)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
