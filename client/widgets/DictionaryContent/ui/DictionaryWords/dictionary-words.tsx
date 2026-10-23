"use client";

import { FC, useEffect, useRef, useState } from "react";
import { Reorder } from "framer-motion";
import { LuPlus } from "react-icons/lu";
import { IDictionaryEntryResponse } from "@/entities/dictionary";
import { AddEntryModal } from "@/features/dictionary/create-dictionary-entry";
import { EditEntryModal } from "@/features/dictionary/update-dictionary-entry";
import { useDictionaryEntriesReorder } from "@/features/dictionary/reorder-dictionary-entries";
import { Button } from "@/shared/radix-ui";
import { DictionaryWordItem } from "./dictionary-word-item";
import { EmptyWords } from "./empty-words";

interface DictionaryWordsProps {
  dictionaryId: string;
  entries: IDictionaryEntryResponse[];
}

export const DictionaryWords: FC<DictionaryWordsProps> = ({
  dictionaryId,
  entries,
}) => {
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<
    IDictionaryEntryResponse | undefined
  >(undefined);

  const [orderedEntries, setOrderedEntries] = useState(entries);
  const orderedEntriesRef = useRef(entries);

  const { reorderEntries } = useDictionaryEntriesReorder(dictionaryId);

  useEffect(() => {
    setOrderedEntries(entries);
    orderedEntriesRef.current = entries;
  }, [entries]);

  const handleReorder = (nextEntries: IDictionaryEntryResponse[]) => {
    setOrderedEntries(nextEntries);
    orderedEntriesRef.current = nextEntries;
  };

  const commitOrder = () => {
    const nextIds = orderedEntriesRef.current.map((entry) => entry.id);
    const isChanged = nextIds.some((id, index) => id !== entries[index]?.id);

    if (isChanged) reorderEntries(nextIds);
  };

  const onEditHandler = (entry: IDictionaryEntryResponse) => {
    setEditingEntry(entry);
    setEditOpen(true);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="w-full flex sm:flex-wrap gap-5 justify-center items-center my-5">
        <Button
          size="lg"
          className="lg:w-[250px] md:w-[180px] sm:w-[180px] w-full"
          onClick={() => setAddOpen(true)}
        >
          <LuPlus /> Add Word
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
      <EditEntryModal
        dictionaryId={dictionaryId}
        entry={editingEntry}
        open={editOpen}
        setOpen={setEditOpen}
      />
    </div>
  );
};
