"use client";

import { FC } from "react";
import { useTranslation } from "@/shared/i18n";
import { INoteResponse, NoteTypeEnum, usePrefetchNote } from "@/entities/note";
import { NOTE_TYPE_ICONS } from "../../lib/sidebar-icons";
import { useFoldedSections } from "../../lib/use-folded-sections";
import { SidebarSection } from "../SidebarSection/sidebar-section";
import { SidebarLink } from "../SidebarSection/sidebar-link";

interface MaterialNotesProps {
  materialId: string;
  notes: INoteResponse[];
  activeNoteId?: string;
  onSelect: (noteId: string) => void;
}

// Notes, and essays in a group of their own; each folds away on its own
export const MaterialNotes: FC<MaterialNotesProps> = ({ materialId, notes, activeNoteId, onSelect }) => {
  const { t } = useTranslation();
  const prefetchNote = usePrefetchNote();
  const { isFolded, toggle } = useFoldedSections();

  const essays = notes.filter((note) => note.type === NoteTypeEnum.essay);
  const others = notes.filter((note) => note.type !== NoteTypeEnum.essay);

  const links = (items: INoteResponse[]) =>
    items.map((note) => (
      <SidebarLink
        key={note.id}
        icon={NOTE_TYPE_ICONS[note.type]}
        label={note.title}
        isActive={note.id === activeNoteId}
        onPrefetch={() => prefetchNote(materialId, note.id)}
        onSelect={() => onSelect(note.id)}
      />
    ));

  return (
    <>
      <SidebarSection
        label={t("materials.sidebar.notes")}
        count={others.length}
        folded={isFolded("notes")}
        onToggleFold={() => toggle("notes")}
      >
        {others.length === 0 ? (
          <p className="px-2 pb-1 text-xs text-neutral-400 dark:text-neutral-500">{t("materials.sidebar.noNotes")}</p>
        ) : (
          links(others)
        )}
      </SidebarSection>

      {/* Only once there is one: an empty "Essays" would be noise in every material */}
      {essays.length > 0 && (
        <SidebarSection
          label={t("materials.sidebar.essays")}
          count={essays.length}
          folded={isFolded("essays")}
          onToggleFold={() => toggle("essays")}
        >
          {links(essays)}
        </SidebarSection>
      )}
    </>
  );
};
