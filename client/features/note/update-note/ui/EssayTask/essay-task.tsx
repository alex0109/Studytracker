"use client";

import { FC, useEffect, useRef, useState } from "react";
import { LuTarget } from "react-icons/lu";
import { useDebounce } from "@/shared/hooks";
import { useTranslation } from "@/shared/i18n";
import { SaveStatus } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { ESSAY_TASK_MAX_LENGTH } from "@/entities/note";
import { useNoteUpdate } from "../../hooks/useNoteUpdate";

interface EssayTaskProps {
  materialId: string;
  noteId: string;
  task?: string | null;
}

// The counter appears only near the limit
const COUNTER_FROM = ESSAY_TASK_MAX_LENGTH - 200;

// What the essay answers: the check judges how well it keeps to this
export const EssayTask: FC<EssayTaskProps> = ({ materialId, noteId, task }) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(task ?? "");
  const lastSent = useRef(task ?? "");
  const { updateNote, updateNoteIsPending, updateNoteIsError } = useNoteUpdate(noteId);

  const save = (next: string) => {
    if (next.trim() === lastSent.current.trim()) return;
    lastSent.current = next;
    updateNote({ materialId, noteId, dataToUpdate: { essayTask: next.trim() } });
  };

  const debounced = useDebounce(value, 1000);
  useEffect(() => {
    save(debounced);
    // save reads the latest props itself; only a pause in typing should run it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-violet-200 bg-violet-50/70 p-4 dark:border-violet-900/60 dark:bg-violet-950/30">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={`essay-task-${noteId}`} className="flex items-center gap-2 text-sm font-semibold text-violet-800 dark:text-violet-300">
          <LuTarget aria-hidden />
          {t("notes.essay.taskLabel")}
        </label>
        <SaveStatus isPending={updateNoteIsPending} isError={updateNoteIsError} />
      </div>
      <textarea
        id={`essay-task-${noteId}`}
        value={value}
        maxLength={ESSAY_TASK_MAX_LENGTH}
        onChange={(event) => setValue(event.target.value)}
        onBlur={() => save(value)}
        rows={2}
        placeholder={t("notes.essay.taskPlaceholder")}
        className="field-sizing-content min-h-16 w-full resize-none rounded-xl border border-violet-200/80 bg-white px-3 py-2 text-sm leading-relaxed outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-300/40 dark:border-violet-900 dark:bg-neutral-950 dark:focus:border-violet-500"
      />
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs text-violet-700/80 dark:text-violet-300/70">{t("notes.essay.taskHint")}</p>
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
    </div>
  );
};
