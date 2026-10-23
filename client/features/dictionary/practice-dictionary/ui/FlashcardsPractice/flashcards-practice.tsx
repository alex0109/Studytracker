"use client";

import { FC, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  flashcardKeys,
  FlashcardSessionModeEnum,
  IFlashcardSessionCreate,
  IFlashcardSessionResponse,
} from "@/entities/flashcard";
import { dictionaryKeys } from "@/entities/dictionary";
import { useFlashcardSessionStart } from "../../hooks/useFlashcardSessionStart";
import { FlashcardsStart } from "../FlashcardsStart/flashcards-start";
import { FlashcardsDeck } from "../FlashcardsDeck/flashcards-deck";

interface FlashcardsPracticeProps {
  dictionaryId: string;
}

export const FlashcardsPractice: FC<FlashcardsPracticeProps> = ({
  dictionaryId,
}) => {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<IFlashcardSessionResponse>();

  const { startSession, startSessionIsPending } =
    useFlashcardSessionStart(dictionaryId);

  const onStartHandler = (body: IFlashcardSessionCreate) => {
    startSession(body, { onSuccess: (response) => setSession(response) });
  };

  // Answers are saved on every swipe, so leaving mid-session still changes progress
  useEffect(() => {
    return () => {
      queryClient.invalidateQueries({
        queryKey: flashcardKeys.stats(dictionaryId),
      });
      queryClient.invalidateQueries({
        queryKey: dictionaryKeys.detail(dictionaryId),
      });
    };
  }, [dictionaryId]);

  if (!session) {
    return (
      <FlashcardsStart
        dictionaryId={dictionaryId}
        isPending={startSessionIsPending}
        onStart={onStartHandler}
      />
    );
  }

  return (
    <FlashcardsDeck
      key={session.id}
      session={session}
      isRepeatPending={startSessionIsPending}
      onRepeat={(entryIds) =>
        onStartHandler({ mode: FlashcardSessionModeEnum.Custom, entryIds })
      }
      onRestart={() => setSession(undefined)}
    />
  );
};
