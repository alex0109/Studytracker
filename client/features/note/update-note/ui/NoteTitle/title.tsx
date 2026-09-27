"use client";

import { FC, useEffect, useState } from "react";
import { Input } from "@/shared/radix-ui";
import { useDebounce } from "@/shared/hooks";

import { IsPendingLoader } from "@/shared/ui";
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
  const [titleValue, setTitleValue] = useState(title);

  const { updateNote, updateNoteIsPending } = useNoteUpdate(noteId);

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

  useEffect(() => {
    if (title !== debouncedTitleValue) {
      updateTitleHandler(materialId, noteId, debouncedTitleValue);
    }
  }, [materialId, noteId, title, debouncedTitleValue]);

  const onUpdateTitle = (newTitle: string) => {
    setTitleValue(newTitle);
  };

  return (
    <div className="flex w-full gap-2">
      <div className="flex-1 w-full">
        <Input
          className="focus:outline-none text-center text-2xl font-bold border-0"
          value={titleValue}
          onChange={(e) => onUpdateTitle(e.target.value)}
          maxLength={30}
          disabled={updateNoteIsPending}
        />
      </div>
    </div>
  );
};
