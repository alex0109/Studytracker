"use client";

import { useTranslation } from "@/shared/i18n";

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
import { FlashcardsPractice } from "@/features/dictionary/practice-dictionary";
import { useActiveSectionContext } from "@/shared/context/active-section.provider";
import { SwitchInterface } from "@/shared/ui/SwitchInterface";
import { Subtitle } from "@/shared/ui";
import { Button } from "@/shared/radix-ui";
import { LuTrash2 } from "react-icons/lu";
import { DictionaryWords } from "../DictionaryWords/dictionary-words";
import { LoadingDictionary } from "./loading-dictionary";

interface DictionaryContentProps {
  materialId: string;
  dictionaryId: string;
  onDeleted?: () => void;
}


export const DictionaryContent: FC<DictionaryContentProps> = ({
  materialId,
  dictionaryId,
  onDeleted,
}) => {
  const { t } = useTranslation();
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
          text={t("dictionary.loadError")}
          textStyles="text-neutral-500"
        />
      </div>
    );
  }

  const entries = exactDictionaryData.entries ?? [];
  const activeEntries = entries.filter((entry) => !entry.isArchived);

  return (
    <div key={dictionaryId} className="flex flex-col w-full p-3 sm:p-5 min-w-0">
      {/* Same layout as a material: counts and the quiet delete on top, then the title */}
      <header className="flex w-full flex-col gap-5 sm:gap-7 mb-2">
        <div className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {t("dictionary.wordsCount", { count: entries.length })} ·{" "}
            {t("dictionary.inFlashcards", { count: activeEntries.length })}
          </p>
          <Button
            variant="ghost"
            aria-label={t("common.delete")}
            title={t("common.delete")}
            className="ml-auto text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
            onClick={() => setOpen(true)}
          >
            <LuTrash2 aria-hidden />
            <span className="hidden sm:inline">{t("common.delete")}</span>
          </Button>
        </div>
        <div className="flex w-full flex-col items-center gap-2">
          <DictionaryTitle
            dictionaryId={dictionaryId}
            title={exactDictionaryData.title}
          />
          <DictionaryDescription
            dictionaryId={dictionaryId}
            description={exactDictionaryData.description}
          />
        </div>
      </header>
      <SwitchInterface switchInterface={dictionaryInterface} />
      {activeSection === DictionaryInterfaceEnum.Flashcards ? (
        <FlashcardsPractice key={dictionaryId} dictionaryId={dictionaryId} />
      ) : (
        <DictionaryWords
          dictionaryId={dictionaryId}
          materialId={materialId}
          entries={entries}
        />
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
