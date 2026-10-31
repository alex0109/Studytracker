"use client";

import { FC, useState } from "react";
import { RichTextDocument } from "@/shared/types";
import { NoteText } from "@/features/note/update-note";
import { GenerateSummaryButton } from "@/features/note/generate-summary";
import { useNoteExact } from "@/entities/note/hooks/useNoteExact";
import { hasTextContent } from "@/entities/note/lib";
import { useTranslation } from "@/shared/i18n";

interface SummaryNoteProps {
  materialId: string;
  noteId: string;
  textContent?: RichTextDocument;
}

export const SummaryNote: FC<SummaryNoteProps> = ({
  materialId,
  noteId,
  textContent,
}) => {
  const { t } = useTranslation();
  // The editor keeps its own state, a new version remounts it with the generated text
  const [content, setContent] = useState(textContent);
  const [version, setVersion] = useState(0);

  // Fresh copy, refetched after every autosave, so the overwrite warning sees the latest text
  const { exactNoteData } = useNoteExact(materialId, noteId);

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-wrap justify-between items-center gap-3 rounded-2xl bg-violet-50 dark:bg-violet-950/40 p-4">
        <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-md">
          {t("notes.summary.hint")}
        </p>
        <GenerateSummaryButton
          materialId={materialId}
          noteId={noteId}
          hasContent={hasTextContent(exactNoteData?.textContent ?? content)}
          onGenerated={(note) => {
            setContent(note.textContent);
            setVersion((value) => value + 1);
          }}
        />
      </div>
      <NoteText
        key={version}
        materialId={materialId}
        propNoteId={noteId}
        textContent={content}
      />
    </div>
  );
};
