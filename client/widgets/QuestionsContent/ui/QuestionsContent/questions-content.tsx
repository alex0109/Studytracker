"use client";

import { FC, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { LuSearch } from "react-icons/lu";
import { useQuestionAll } from "@/entities/question";
import { usePendingNavigation } from "@/shared/lib/use-pending-navigation";
import { QuestionCreateModal } from "@/features/question/create-question/ui";
import { GenerateQuestionsModal } from "@/features/question/generate-questions";
import { StartAttemptModal } from "@/features/attempt/start-attempt";
import { useTranslation } from "@/shared/i18n";
import { QuestionsToolbar } from "../QuestionsToolbar/questions-toolbar";
import { QuestionCard } from "../QuestionCard/question-card";
import { EmptyQuestions } from "./empty-questions";
import LoadingQuestions from "./loading-questions";

interface QuestionsType {
  materialId: string;
  noteId?: string;
  assessmentId: string;
}

// From this many questions on, a search helps to find one to edit
const SEARCH_FROM = 7;

export const QuestionsContent: FC<QuestionsType> = ({ materialId, noteId, assessmentId }) => {
  const { t } = useTranslation();
  const [createOpen, setCreateOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const { navigate, isNavigating } = usePendingNavigation();
  const path = usePathname();
  const { questionsData, questionsIsPending } = useQuestionAll(materialId);

  // A note shows its own questions; the material shows all of them
  const questions = useMemo(
    () =>
      (questionsData ?? []).filter((item) => item.isActive && (!noteId || item.noteId === noteId)),
    [questionsData, noteId],
  );

  const normalized = query.trim().toLocaleLowerCase();
  const shown = normalized
    ? questions.filter(
        (item) =>
          item.title.toLocaleLowerCase().includes(normalized) ||
          (item.answer ?? "").toLocaleLowerCase().includes(normalized),
      )
    : questions;

  // The server draws only from active questions
  const canStart = !!questionsData?.some((item) => item.isActive) && !isNavigating;

  return (
    <div className="flex w-full flex-col gap-4 py-4">
      <QuestionsToolbar
        count={questions.length}
        canStart={canStart}
        isStarting={isNavigating}
        onAdd={() => setCreateOpen(true)}
        onGenerate={() => setGenerateOpen(true)}
        onStart={() => setStartOpen(true)}
      />

      {questions.length >= SEARCH_FROM && (
        <div className="relative">
          <LuSearch aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("questions.editor.search")}
            aria-label={t("questions.editor.search")}
            className="h-10 w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-300/50 dark:border-neutral-800 dark:bg-neutral-950"
          />
        </div>
      )}

      {questionsIsPending ? (
        <LoadingQuestions />
      ) : questions.length === 0 ? (
        <EmptyQuestions />
      ) : shown.length === 0 ? (
        <p className="py-6 text-center text-sm text-neutral-500">{t("questions.editor.nothingFound")}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {shown.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              index={index}
              isOpen={openId === question.id}
              onToggle={() => setOpenId((current) => (current === question.id ? null : question.id))}
              showNoteMark={!noteId}
            />
          ))}
        </ul>
      )}

      <QuestionCreateModal materialId={materialId} noteId={noteId} open={createOpen} setOpen={setCreateOpen} />
      <StartAttemptModal
        open={startOpen}
        onClose={() => setStartOpen(false)}
        materialId={materialId}
        assessmentId={assessmentId}
        isOpening={isNavigating}
        onStarted={(attemptId) => navigate(`${path}/${materialId}/attempt/${attemptId}`)}
      />
      <GenerateQuestionsModal materialId={materialId} noteId={noteId} open={generateOpen} setOpen={setGenerateOpen} />
    </div>
  );
};
