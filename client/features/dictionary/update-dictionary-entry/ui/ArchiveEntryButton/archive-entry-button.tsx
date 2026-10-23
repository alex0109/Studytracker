"use client";

import { FC } from "react";
import { LuArchive, LuArchiveRestore } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { useDictionaryEntryUpdate } from "../../hooks/useDictionaryEntryUpdate";

interface ArchiveEntryButtonProps {
  dictionaryId: string;
  entryId: string;
  isArchived: boolean;
}

export const ArchiveEntryButton: FC<ArchiveEntryButtonProps> = ({
  dictionaryId,
  entryId,
  isArchived,
}) => {
  const { updateEntry, updateEntryIsPending } = useDictionaryEntryUpdate(
    dictionaryId,
    entryId,
  );

  return (
    <Button
      variant="ghost"
      size="icon"
      title={isArchived ? "Return to flashcards" : "Hide from flashcards"}
      disabled={updateEntryIsPending}
      onClick={() =>
        updateEntry({ entryId, dataToUpdate: { isArchived: !isArchived } })
      }
    >
      {isArchived ? <LuArchiveRestore /> : <LuArchive />}
    </Button>
  );
};
