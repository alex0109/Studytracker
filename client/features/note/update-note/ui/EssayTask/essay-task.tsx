"use client";

import { FC, useEffect, useRef, useState } from "react";
import { LuClock, LuGraduationCap, LuLightbulb, LuPencilLine, LuTarget, LuX } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { useDebounce } from "@/shared/hooks";
import { useTranslation } from "@/shared/i18n";
import { SaveStatus } from "@/shared/ui";
import { cn } from "@/shared/lib";
import {
  ESSAY_EXAMS,
  ESSAY_TASK_MAX_LENGTH,
  essayFormatCode,
  essayFormatMinWords,
  IEssayFormat,
  parseEssayFormat,
} from "@/entities/note";
import { useNoteUpdate } from "../../hooks/useNoteUpdate";
import { EssayTopicsModal } from "./essay-topics-modal";

interface EssayTaskProps {
  materialId: string;
  noteId: string;
  task?: string | null;
  // The exam the essay is written for, like "Ielts/B2/Letter"
  format?: string | null;
}

// The counter appears only near the limit
const COUNTER_FROM = ESSAY_TASK_MAX_LENGTH - 200;

// What the exam expects of this text, in one line
const ExamFormat: FC<{ format: IEssayFormat; onClear: () => void }> = ({ format, onClear }) => {
  const { t } = useTranslation();
  const info = ESSAY_EXAMS[format.exam];
  const facts = info.facts[format.kind];
  const minWords = essayFormatMinWords(format);

  return (
    <div className="flex items-start gap-3 rounded-xl border border-orange-200 bg-white p-3 sm:p-3.5 dark:border-orange-900/60 dark:bg-neutral-950">
      <span aria-hidden className="hidden size-9 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
        <LuGraduationCap />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-semibold text-neutral-900 dark:text-neutral-50">
          {info.name}
          <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-800 dark:bg-orange-950 dark:text-orange-300">
            {format.level}
          </span>
        </p>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-neutral-600 dark:text-neutral-400">
          <span className="flex items-center gap-1.5">
            <LuPencilLine aria-hidden className="text-orange-500" />
            {t(`notes.essay.kinds.${format.exam}.${format.kind}`)}
            {minWords && ` · ${t("notes.essay.minWords", { count: minWords })}`}
          </span>
          {facts.minutes && (
            <span className="flex items-center gap-1.5">
              <LuClock aria-hidden className="text-orange-500" />
              {t("notes.essay.minutes", { count: facts.minutes })}
            </span>
          )}
        </p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {t("notes.essay.exams.checkedBy", { exam: info.short })} {t("notes.essay.exams.notAffiliated")}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onClear}
        aria-label={t("notes.essay.exams.clear")}
        title={t("notes.essay.exams.clear")}
        className="shrink-0 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
      >
        <LuX />
      </Button>
    </div>
  );
};

// What the essay answers: the check judges how well it keeps to this, by an exam's rules when one is chosen
export const EssayTask: FC<EssayTaskProps> = ({ materialId, noteId, task, format }) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(task ?? "");
  const [topicsOpen, setTopicsOpen] = useState(false);
  const lastSent = useRef(task ?? "");
  const { updateNote, updateNoteIsPending, updateNoteIsError } = useNoteUpdate(noteId);
  const examFormat = parseEssayFormat(format);

  const save = (next: string) => {
    if (next.trim() === lastSent.current.trim()) return;
    lastSent.current = next;
    updateNote({ materialId, noteId, dataToUpdate: { essayTask: next.trim() } });
  };

  // A ready topic is saved at once with its exam: nothing is typed, so there is no pause to wait for
  const pickTopic = (topic: string, nextFormat: IEssayFormat | null) => {
    setValue(topic);
    lastSent.current = topic;
    updateNote({
      materialId,
      noteId,
      dataToUpdate: { essayTask: topic.trim(), essayFormat: nextFormat ? essayFormatCode(nextFormat) : "" },
    });
    setTopicsOpen(false);
  };

  const clearExam = () => updateNote({ materialId, noteId, dataToUpdate: { essayFormat: "" } });

  const debounced = useDebounce(value, 1000);
  useEffect(() => {
    save(debounced);
    // save reads the latest props itself; only a pause in typing should run it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const isEmpty = value.trim().length === 0;

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-orange-200 bg-orange-50/80 p-4 sm:p-5 dark:border-orange-900/60 dark:bg-orange-950/25">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <label
          htmlFor={`essay-task-${noteId}`}
          className="flex items-center gap-2 font-semibold text-orange-900 dark:text-orange-200"
        >
          <span aria-hidden className="flex size-8 items-center justify-center rounded-lg bg-orange-500 text-white">
            <LuTarget />
          </span>
          {t("notes.essay.taskLabel")}
          <SaveStatus isPending={updateNoteIsPending} isError={updateNoteIsError} />
        </label>
        {!isEmpty && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setTopicsOpen(true)}
            className="border-orange-300 bg-white text-orange-800 hover:bg-orange-100 hover:text-orange-900 dark:border-orange-800 dark:bg-neutral-950 dark:text-orange-300 dark:hover:bg-orange-950"
          >
            <LuLightbulb /> {t("notes.essay.changeTopic")}
          </Button>
        )}
      </div>

      {examFormat && <ExamFormat format={examFormat} onClear={clearExam} />}

      {isEmpty && (
        <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-orange-300 bg-white/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-orange-800 dark:bg-neutral-950/60">
          <div className="flex flex-col gap-0.5">
            <p className="font-medium text-neutral-900 dark:text-neutral-50">{t("notes.essay.pickTitle")}</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">{t("notes.essay.pickText")}</p>
          </div>
          <Button
            size="lg"
            onClick={() => setTopicsOpen(true)}
            className="w-full shrink-0 bg-orange-600 text-white hover:bg-orange-700 sm:w-auto dark:bg-orange-600 dark:text-white dark:hover:bg-orange-500"
          >
            <LuLightbulb /> {t("notes.essay.topicsButton")}
          </Button>
        </div>
      )}

      <textarea
        id={`essay-task-${noteId}`}
        value={value}
        maxLength={ESSAY_TASK_MAX_LENGTH}
        onChange={(event) => setValue(event.target.value)}
        onBlur={() => save(value)}
        rows={2}
        placeholder={t(isEmpty ? "notes.essay.taskPlaceholderOwn" : "notes.essay.taskPlaceholder")}
        className="field-sizing-content min-h-16 w-full resize-none whitespace-pre-wrap rounded-xl border border-orange-200 bg-white px-3.5 py-2.5 text-base leading-relaxed outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-300/30 sm:text-[15px] dark:border-orange-900 dark:bg-neutral-950 dark:focus:border-orange-600"
      />
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs text-orange-900/70 dark:text-orange-200/70">
          {t(examFormat ? "notes.essay.taskHintExam" : "notes.essay.taskHint")}
        </p>
        {value.length >= COUNTER_FROM && (
          <span
            className={cn(
              "shrink-0 text-xs tabular-nums text-neutral-500",
              value.length >= ESSAY_TASK_MAX_LENGTH && "text-red-500",
            )}
          >
            {value.length}/{ESSAY_TASK_MAX_LENGTH}
          </span>
        )}
      </div>
      {topicsOpen && (
        <EssayTopicsModal open onClose={() => setTopicsOpen(false)} onPick={pickTopic} current={examFormat} />
      )}
    </section>
  );
};
