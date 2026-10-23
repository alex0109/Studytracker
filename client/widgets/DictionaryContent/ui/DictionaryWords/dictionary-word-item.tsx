"use client";

import { FC } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { LuGripVertical, LuPencil } from "react-icons/lu";
import {
  IDictionaryEntryResponse,
  PartOfSpeechBadge,
} from "@/entities/dictionary";
import { ArchiveEntryButton } from "@/features/dictionary/update-dictionary-entry";
import { DeleteEntryButton } from "@/features/dictionary/delete-dictionary-entry";
import { Button } from "@/shared/radix-ui";
import { cn } from "@/shared/lib";

interface DictionaryWordItemProps {
  dictionaryId: string;
  entry: IDictionaryEntryResponse;
  onEdit: (entry: IDictionaryEntryResponse) => void;
  onDragEnd: () => void;
}

export const DictionaryWordItem: FC<DictionaryWordItemProps> = ({
  dictionaryId,
  entry,
  onEdit,
  onDragEnd,
}) => {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={entry}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onDragEnd}
      className={cn(
        "flex items-center gap-3 rounded-2xl border-3 border-white dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900 p-3",
        entry.isArchived && "opacity-60",
      )}
    >
      <button
        type="button"
        aria-label="Drag to reorder"
        onPointerDown={(e) => controls.start(e)}
        className="p-1 cursor-grab active:cursor-grabbing touch-none text-neutral-400 hover:text-neutral-600"
      >
        <LuGripVertical />
      </button>

      <div className="flex flex-1 flex-col min-w-0 gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-lg font-bold break-words">{entry.term}</span>
          {entry.transcription && (
            <span className="text-sm text-neutral-500">
              {entry.transcription}
            </span>
          )}
          <PartOfSpeechBadge partOfSpeech={entry.partOfSpeech} />
          {entry.isArchived && (
            <span className="rounded-xl bg-neutral-200 dark:bg-neutral-700 px-2 py-0.5 text-xs text-neutral-600 dark:text-neutral-300">
              archived
            </span>
          )}
        </div>
        <p className="text-neutral-700 dark:text-neutral-300 break-words">
          {entry.translation}
        </p>
        {entry.example && (
          <p className="text-xs italic text-neutral-500 truncate">
            &ldquo;{entry.example}&rdquo;
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          title="Edit word"
          onClick={() => onEdit(entry)}
        >
          <LuPencil />
        </Button>
        <ArchiveEntryButton
          dictionaryId={dictionaryId}
          entryId={entry.id}
          isArchived={entry.isArchived}
        />
        <DeleteEntryButton dictionaryId={dictionaryId} entryId={entry.id} />
      </div>
    </Reorder.Item>
  );
};
