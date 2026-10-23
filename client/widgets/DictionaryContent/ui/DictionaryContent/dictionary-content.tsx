"use client";

import { FC, useState } from "react";
import {
  dictionaryInterface,
  DictionaryInterfaceEnum,
  useDictionaryExact,
} from "@/entities/dictionary";
import {
  DictionaryDescription,
  DictionaryTitle,
} from "@/features/dictionary/update-dictionary";
import { DictionaryDeleteModal } from "@/features/dictionary/delete-dictionary";
import { FlashcardsDeck } from "@/features/dictionary/practice-dictionary";
import { useActiveSectionContext } from "@/shared/context/active-section.provider";
import { SwitchInterface } from "@/shared/ui/SwitchInterface";
import { Subtitle } from "@/shared/ui";
import { Button } from "@/shared/radix-ui";
import { DictionaryWords } from "../DictionaryWords/dictionary-words";
import { LoadingDictionary } from "./loading-dictionary";

interface DictionaryContentProps {
  materialId: string;
  dictionaryId: string;
  onDeleted?: () => void;
}

const pluralizeWords = (count: number) =>
  `${count} ${count === 1 ? "word" : "words"}`;

export const DictionaryContent: FC<DictionaryContentProps> = ({
  materialId,
  dictionaryId,
  onDeleted,
}) => {
  const { activeSection } = useActiveSectionContext();
  const [open, setOpen] = useState(false);

  const { exactDictionaryData, exactDictionaryIsPending } =
    useDictionaryExact(dictionaryId);

  if (exactDictionaryIsPending) {
    return <LoadingDictionary />;
  }

  if (!exactDictionaryData) {
    return (
      <div className="flex flex-col w-full min-h-[500px] justify-center items-center p-5">
        <Subtitle
          text="Dictionary could not be loaded..."
          textStyles="text-neutral-500"
        />
      </div>
    );
  }

  const entries = exactDictionaryData.entries ?? [];
  const activeEntries = entries.filter((entry) => !entry.isArchived);

  return (
    <div key={dictionaryId} className="flex flex-col w-full p-5 min-w-0">
      <div className="flex flex-col w-full justify-center items-center mb-5">
        <div className="flex w-full justify-end">
          <div>
            <Button
              size="lg"
              variant="destructive"
              onClick={() => setOpen(true)}
            >
              Delete
            </Button>
          </div>
        </div>
        <DictionaryTitle
          dictionaryId={dictionaryId}
          title={exactDictionaryData.title}
        />
        <DictionaryDescription
          dictionaryId={dictionaryId}
          description={exactDictionaryData.description}
        />
        <p className="text-sm text-neutral-500">
          {pluralizeWords(entries.length)} ·{" "}
          {pluralizeWords(activeEntries.length)} in flashcards
        </p>
      </div>
      <SwitchInterface switchInterface={dictionaryInterface} />
      {activeSection === DictionaryInterfaceEnum.Flashcards ? (
        <FlashcardsDeck key={dictionaryId} entries={activeEntries} />
      ) : (
        <DictionaryWords dictionaryId={dictionaryId} entries={entries} />
      )}
      <DictionaryDeleteModal
        materialId={materialId}
        dictionaryId={dictionaryId}
        open={open}
        setOpen={setOpen}
        onDeleted={onDeleted}
      />
    </div>
  );
};
