"use client";

import { useTranslation } from "@/shared/i18n";

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
  const { t } = useTranslation();
  const { updateEntry, updateEntryIsPending } = useDictionaryEntryUpdate(
    dictionaryId,
    entryId,
  );

  return (
    <Button
      variant="ghost"
      size="icon"
      title={isArchived ? t("dictionary.unarchive") : t("dictionary.archive")}
      aria-label={isArchived ? t("dictionary.unarchive") : t("dictionary.archive")}
      disabled={updateEntryIsPending}
      onClick={() =>
        updateEntry({ entryId, dataToUpdate: { isArchived: !isArchived } })
      }
    >
      {isArchived ? <LuArchiveRestore /> : <LuArchive />}
    </Button>
  );
};
