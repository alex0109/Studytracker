"use client";

import { FC, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LuArrowLeft } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
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
  // On while cards are being answered, so the page can make room for them; off again once the last one is done
  onPracticingChange?: (practicing: boolean) => void;
}

export const FlashcardsPractice: FC<FlashcardsPracticeProps> = ({
  dictionaryId,
  onPracticingChange,
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [session, setSession] = useState<IFlashcardSessionResponse>();
  const [completedId, setCompletedId] = useState<string>();
  const practicing = !!session && completedId !== session.id;

  const { startSession, startSessionIsPending } =
    useFlashcardSessionStart(dictionaryId);

  const onStartHandler = (body: IFlashcardSessionCreate) => {
    startSession(body, { onSuccess: (response) => setSession(response) });
  };

  useEffect(() => {
    onPracticingChange?.(practicing);
  }, [practicing, onPracticingChange]);

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
  }, [dictionaryId, queryClient]);

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
    <div className="flex w-full flex-col">
      {/* Every answer is already saved, so stopping halfway loses nothing */}
      {practicing && (
        <Button variant="ghost" size="sm" className="self-start" onClick={() => setSession(undefined)}>
          <LuArrowLeft aria-hidden /> {t("flashcards.backToWords")}
        </Button>
      )}
      <FlashcardsDeck
        key={session.id}
        session={session}
        isRepeatPending={startSessionIsPending}
        onRepeat={(entryIds) =>
          onStartHandler({ mode: FlashcardSessionModeEnum.Custom, entryIds })
        }
        onRestart={() => setSession(undefined)}
        onComplete={() => setCompletedId(session.id)}
      />
    </div>
  );
};
