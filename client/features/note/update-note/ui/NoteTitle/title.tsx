"use client";

import { FC, useEffect, useState } from "react";
import { useDebounce } from "@/shared/hooks";
import { useTranslation } from "@/shared/i18n";
import { SaveStatus, TitleInput } from "@/shared/ui";
import { useNoteUpdate } from "../../hooks/useNoteUpdate";

interface NoteTitleProps {
  materialId: string;
  noteId: string;
  title: string;
}

export const NoteTitle: FC<NoteTitleProps> = ({
  materialId,
  noteId,
  title,
}) => {
  const { t } = useTranslation();
  const [titleValue, setTitleValue] = useState(title);

  const { updateNote, updateNoteIsPending, updateNoteIsError } =
    useNoteUpdate(noteId);

  const updateTitleHandler = (
    materialId: string,
    noteId: string,
    title: string,
  ): void => {
    updateNote({
      materialId: materialId,
      noteId: noteId,
      dataToUpdate: { title },
    });
  };

  const debouncedTitleValue = useDebounce(titleValue, 1500);

  // The field stays editable while it saves: disabling it threw the cursor out mid-word
  useEffect(() => {
    if (title !== debouncedTitleValue && debouncedTitleValue.trim()) {
      updateTitleHandler(materialId, noteId, debouncedTitleValue);
    }
  }, [materialId, noteId, title, debouncedTitleValue]);

  return (
    <div className="flex flex-col w-full gap-1 justify-center items-center">
      <div className="relative w-full">
        <TitleInput
          value={titleValue}
          onChange={setTitleValue}
          maxLength={70}
          ariaLabel={t("materials.titleLabel")}
        />
        <SaveStatus
          isPending={updateNoteIsPending}
          isError={updateNoteIsError}
          className="absolute top-1/2 right-1 -translate-y-1/2"
        />
      </div>
      <p className="text-xs text-neutral-500">{noteId.split("-")[0]}</p>
    </div>
  );
};
