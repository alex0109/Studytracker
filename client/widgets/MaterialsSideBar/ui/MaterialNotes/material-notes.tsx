"use client";

import { FC } from "react";
import { useTranslation } from "@/shared/i18n";
import { INoteResponse, NoteTypeEnum, usePrefetchNote } from "@/entities/note";
import { AddNoteModal } from "@/features/note/create-note";
import { NOTE_TYPE_ICONS } from "../../lib/sidebar-icons";
import { SidebarSection } from "../SidebarSection/sidebar-section";
import { SidebarLink } from "../SidebarSection/sidebar-link";

interface MaterialNotesProps {
  materialId: string;
  notes: INoteResponse[];
  activeNoteId?: string;
  onSelect: (noteId: string) => void;
}

export const MaterialNotes: FC<MaterialNotesProps> = ({ materialId, notes, activeNoteId, onSelect }) => {
  const { t } = useTranslation();
  const prefetchNote = usePrefetchNote();

  return (
    <SidebarSection
      label={t("materials.sidebar.notes")}
      count={notes.length}
      action={
        <AddNoteModal
          materialId={materialId}
          hasSummary={notes.some((note) => note.type === NoteTypeEnum.summary)}
          variant="icon"
        />
      }
    >
      {notes.length === 0 ? (
        <p className="px-2 pb-1 text-xs text-neutral-400 dark:text-neutral-500">{t("materials.sidebar.noNotes")}</p>
      ) : (
        notes.map((note) => (
          <SidebarLink
            key={note.id}
            icon={NOTE_TYPE_ICONS[note.type]}
            label={note.title}
            isActive={note.id === activeNoteId}
            onPrefetch={() => prefetchNote(materialId, note.id)}
            onSelect={() => onSelect(note.id)}
          />
        ))
      )}
    </SidebarSection>
  );
};
