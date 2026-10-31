"use client";

import { useTranslation } from "@/shared/i18n";

import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Reorder } from "framer-motion";
import { LuPlus, LuSparkles } from "react-icons/lu";
import { IDictionaryEntryResponse } from "@/entities/dictionary";
import { AddEntryModal } from "@/features/dictionary/create-dictionary-entry";
import { GenerateEntriesModal } from "@/features/dictionary/generate-dictionary-entries";
import { EditEntryModal } from "@/features/dictionary/update-dictionary-entry";
import { useDictionaryEntriesReorder } from "@/features/dictionary/reorder-dictionary-entries";
import { Button } from "@/shared/radix-ui";
import { LimitCounter } from "@/shared/ui";
import { isLimitReached } from "@/shared/lib";
import { useLimits } from "@/entities/limits";
import { DictionaryWordItem } from "./dictionary-word-item";
import { EmptyWords } from "./empty-words";

interface DictionaryWordsProps {
  dictionaryId: string;
  materialId: string;
  entries: IDictionaryEntryResponse[];
}

export const DictionaryWords: FC<DictionaryWordsProps> = ({
  dictionaryId,
  materialId,
  entries,
}) => {
  const { t } = useTranslation();
  const [addOpen, setAddOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<
    IDictionaryEntryResponse | undefined
  >(undefined);

  const [orderedEntries, setOrderedEntries] = useState(entries);
  const orderedEntriesRef = useRef(entries);

  const { reorderEntries } = useDictionaryEntriesReorder(dictionaryId);
  const { limitsData } = useLimits();

  const isWordsFull = isLimitReached(
    entries.length,
    limitsData?.maxEntriesPerDictionary,
  );

  // A new list from the server replaces the local order
  const [shownEntries, setShownEntries] = useState(entries);
  if (entries !== shownEntries) {
    setShownEntries(entries);
    setOrderedEntries(entries);
  }

  useEffect(() => {
    orderedEntriesRef.current = entries;
  }, [entries]);

  const handleReorder = (nextEntries: IDictionaryEntryResponse[]) => {
    setOrderedEntries(nextEntries);
    orderedEntriesRef.current = nextEntries;
  };

  // Stable handlers keep the memoized word rows from re-rendering when a modal opens
  const commitOrder = useCallback(() => {
    const nextIds = orderedEntriesRef.current.map((entry) => entry.id);
    const isChanged = nextIds.some((id, index) => id !== entries[index]?.id);

    if (isChanged) reorderEntries(nextIds);
  }, [entries, reorderEntries]);

  const onEditHandler = useCallback((entry: IDictionaryEntryResponse) => {
    setEditingEntry(entry);
    setEditOpen(true);
  }, []);

  return (
    <div className="flex flex-col w-full">
      <div className="w-full flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-5 justify-center items-center my-5">
        <Button
          size="lg"
          className="lg:w-[250px] md:w-[180px] sm:w-[180px] w-full"
          disabled={isWordsFull}
          title={
            isWordsFull
              ? t("dictionary.wordsLimitHint", { count: limitsData?.maxEntriesPerDictionary })
              : undefined
          }
          onClick={() => setAddOpen(true)}
        >
          <LuPlus /> {isWordsFull ? t("dictionary.wordsLimitReached") : t("dictionary.addWord")}
          <LimitCounter
            used={entries.length}
            max={limitsData?.maxEntriesPerDictionary}
            label={t("limits.counter.words")}
          />
        </Button>
        <Button
          size="lg"
          className="lg:w-[250px] md:w-[180px] sm:w-[180px] w-full bg-violet-700 hover:bg-violet-800"
          disabled={isWordsFull}
          onClick={() => setGenerateOpen(true)}
        >
          <LuSparkles /> {t("dictionary.generate.title")}
        </Button>
      </div>

      {orderedEntries.length > 0 ? (
        <Reorder.Group
          axis="y"
          values={orderedEntries}
          onReorder={handleReorder}
          className="flex flex-col gap-3"
        >
          {orderedEntries.map((entry) => (
            <DictionaryWordItem
              key={entry.id}
              dictionaryId={dictionaryId}
              entry={entry}
              onEdit={onEditHandler}
              onDragEnd={commitOrder}
            />
          ))}
        </Reorder.Group>
      ) : (
        <EmptyWords />
      )}

      <AddEntryModal
        dictionaryId={dictionaryId}
        open={addOpen}
        setOpen={setAddOpen}
      />
      <GenerateEntriesModal
        dictionaryId={dictionaryId}
        materialId={materialId}
        freeSlots={
          (limitsData?.maxEntriesPerDictionary ?? Infinity) - entries.length
        }
        open={generateOpen}
        setOpen={setGenerateOpen}
      />
      <EditEntryModal
        dictionaryId={dictionaryId}
        entry={editingEntry}
        open={editOpen}
        setOpen={setEditOpen}
      />
    </div>
  );
};
