"use client";

import { FC, useEffect, useRef } from "react";
import { LuFileCheck } from "react-icons/lu";
import { RichTextDocument } from "@/shared/types";
import { useTranslation } from "@/shared/i18n";
import { EssayTask, NoteText } from "@/features/note/update-note";
import { ReviewEssayButton } from "@/features/note/review-essay";
import { countDocumentWords, EssayCriterion, EssayReviewCard, useNoteExact } from "@/entities/note";

const CRITERIA: EssayCriterion[] = ["TaskResponse", "Coherence", "Vocabulary", "Grammar"];

interface EssayNoteProps {
  materialId: string;
  noteId: string;
  textContent?: RichTextDocument;
}

export const EssayNote: FC<EssayNoteProps> = ({ materialId, noteId, textContent }) => {
  const { t } = useTranslation();
  // Refreshed after every autosave, so the word count and the review follow the saved note
  const { exactNoteData } = useNoteExact(materialId, noteId);
  const review = exactNoteData?.essayReview ?? null;
  const wordCount = countDocumentWords(exactNoteData?.textContent ?? textContent);

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
      <EssayTask materialId={materialId} noteId={noteId} task={exactNoteData?.essayTask} />

      <NoteText materialId={materialId} propNoteId={noteId} textContent={textContent} />

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white/80 p-4 dark:border-neutral-800 dark:bg-neutral-900/80">
        <div className="flex flex-col">
          <span className="text-2xl font-semibold tabular-nums">{wordCount}</span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {t("notes.essay.wordsLabel", { count: wordCount })}
          </span>
        </div>
        <ReviewEssayButton
          materialId={materialId}
          noteId={noteId}
          wordCount={wordCount}
          hasReview={!!review}
        />
      </div>

      <div ref={resultRef} className="scroll-mt-24">
        {review ? (
          <EssayReviewCard review={review} />
        ) : (
          <div className="flex flex-col gap-3 rounded-3xl border border-dashed border-neutral-300 p-5 dark:border-neutral-700">
            <p className="flex items-center gap-2 font-medium">
              <LuFileCheck className="text-violet-600 dark:text-violet-400" aria-hidden />
              {t("notes.essay.empty.title")}
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">{t("notes.essay.empty.text")}</p>
            <ul className="flex flex-wrap gap-2">
              {CRITERIA.map((criterion) => (
                <li
                  key={criterion}
                  className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                >
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
