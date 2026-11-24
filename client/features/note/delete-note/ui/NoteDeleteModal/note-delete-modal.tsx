"use client";

import { FC } from "react";
import { ConfirmModal } from "@/shared/ui";
import { useTranslation } from "@/shared/i18n";
import { NoteTypeEnum } from "@/entities/note";
import { useNoteDelete } from "../../hooks/useNoteDelete";

interface NoteDeleteModalProps {
  materialId: string;
  noteId: string;
  title: string;
  type: NoteTypeEnum;
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  onDeleted?: () => void;
}

// Names what goes: the kind of note in the question, its title in the warning
export const NoteDeleteModal: FC<NoteDeleteModalProps> = ({
  materialId,
  noteId,
  title,
  type,
  open,
  setOpen,
  onDeleted,
}) => {
  const { t } = useTranslation();
  const { deleteNote, deleteNoteIsPending } = useNoteDelete(materialId, noteId);
  const name = title.trim();

  const handleDelete = () => {
    deleteNote(undefined, {
      onSuccess: () => {
        setOpen(false);
        onDeleted?.();
      },
    });
  };

  return (
    <ConfirmModal
      open={open}
      onClose={() => setOpen(false)}
      onConfirm={handleDelete}
      pending={deleteNoteIsPending}
      title={t(`notes.delete.title.${type}`)}
      description={name ? t("notes.delete.warning", { title: name }) : t("notes.delete.warningUntitled")}
      confirmText={t("common.delete")}
    />
  );
};
