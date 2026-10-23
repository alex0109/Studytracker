"use client";

import { FC } from "react";
import { LuTrash2 } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { useDictionaryEntryDelete } from "../../hooks/useDictionaryEntryDelete";

interface DeleteEntryButtonProps {
  dictionaryId: string;
  entryId: string;
}

export const DeleteEntryButton: FC<DeleteEntryButtonProps> = ({
  dictionaryId,
  entryId,
}) => {
  const { deleteEntry, deleteEntryIsPending } =
    useDictionaryEntryDelete(dictionaryId);

  return (
    <Button
      variant="ghost"
      size="icon"
      title="Delete word"
      className="text-red-500 hover:text-red-600"
      disabled={deleteEntryIsPending}
      onClick={() => deleteEntry(entryId)}
    >
      <LuTrash2 />
    </Button>
  );
};
