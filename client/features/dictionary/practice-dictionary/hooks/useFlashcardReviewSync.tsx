"use client";

import { useRef } from "react";
import {
  IFlashcardReviewCreate,
  IFlashcardSessionResponse,
} from "@/entities/flashcard";
import { useFlashcardReviewSubmit } from "./useFlashcardReviewSubmit";
import { useFlashcardReviewUndo } from "./useFlashcardReviewUndo";
import { useFlashcardSessionFinish } from "./useFlashcardSessionFinish";

// Sends answers in the background while the deck keeps going.
// Requests for one card run one after another, so an undo never overtakes its review
// and a repeated answer never overtakes the undo.
export const useFlashcardReviewSync = (session: IFlashcardSessionResponse) => {
  const { submitReview } = useFlashcardReviewSubmit(session.id);
  const { undoReview } = useFlashcardReviewUndo(session.id);
  const { finishSession } = useFlashcardSessionFinish(session.dictionaryId);

  const entryOperations = useRef(new Map<string, Promise<void>>());
  const savedReviews = useRef(new Map<string, Promise<boolean>>());

  const runForEntry = (entryId: string, task: () => Promise<unknown>) => {
    const previous = entryOperations.current.get(entryId) ?? Promise.resolve();
    const next = previous.then(task).then(
      () => undefined,
      () => undefined,
    );

    entryOperations.current.set(entryId, next);
  };

  const saveReview = (body: IFlashcardReviewCreate) => {
    const saved = new Promise<boolean>((resolve) => {
      runForEntry(body.entryId, () =>
        submitReview(body).then(
          () => resolve(true),
          () => resolve(false),
        ),
      );
    });

    savedReviews.current.set(body.id, saved);
  };

  const removeReview = (entryId: string, reviewId: string) => {
    runForEntry(entryId, async () => {
      const isSaved = await savedReviews.current.get(reviewId);
      savedReviews.current.delete(reviewId);

      if (isSaved) await undoReview(reviewId);
    });
  };

  const finish = async () => {
    await Promise.all(entryOperations.current.values());
    finishSession(session.id);
  };

  return { saveReview, removeReview, finish };
};
