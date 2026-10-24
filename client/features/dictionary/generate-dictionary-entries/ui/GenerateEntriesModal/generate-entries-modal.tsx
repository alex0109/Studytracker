"use client";

import { FC, useEffect, useState } from "react";
import { LuSparkles } from "react-icons/lu";
import { IsPendingLoader, Modal, Title } from "@/shared/ui";
import { Button, Separator } from "@/shared/radix-ui";
import { cn } from "@/shared/lib";
import { useMaterialAll } from "@/entities/material";
import { NoteTypeEnum } from "@/entities/note/model";
import {
  AiFeatureEnum,
  AiUsageHint,
  getFeatureUsage,
  useAiUsage,
} from "@/entities/ai";
import { useDictionaryEntriesGenerate } from "../../hooks/useDictionaryEntriesGenerate";
import {
  getBrowserLanguage,
  TRANSLATION_LANGUAGES,
} from "../../lib/translation-languages";

interface GenerateEntriesModalProps {
  dictionaryId: string;
  materialId: string;
  // Free places for words in the dictionary
  freeSlots: number;
  open: boolean;
  setOpen: (isOpen: boolean) => void;
}

const COUNT_OPTIONS = [5, 10, 15, 20];
const MATERIAL_SOURCE = "material";

export const GenerateEntriesModal: FC<GenerateEntriesModalProps> = ({
  dictionaryId,
  materialId,
  freeSlots,
  open,
  setOpen,
}) => {
  const [source, setSource] = useState(MATERIAL_SOURCE);
  const [count, setCount] = useState(10);
  const [language, setLanguage] = useState("English");

  useEffect(() => {
    setLanguage(getBrowserLanguage());
  }, []);

  // Only notes of this dictionary's material can be a source
  const { materialsData } = useMaterialAll();
  const textNotes =
    materialsData
      ?.find((material) => material.id === materialId)
      ?.notes?.filter(
        (note) =>
          note.type === NoteTypeEnum.text || note.type === NoteTypeEnum.summary,
      ) ?? [];

  const { aiUsageData } = useAiUsage(open);
  const { isAvailable } = getFeatureUsage(
    aiUsageData,
    AiFeatureEnum.DictionaryGeneration,
  );
  const { generateEntries, generateEntriesIsPending } =
    useDictionaryEntriesGenerate(dictionaryId);

  const maxCount = Math.max(0, Math.min(20, freeSlots));
  const selectedCount = Math.min(count, maxCount);
  const languages = TRANSLATION_LANGUAGES.includes(language)
    ? TRANSLATION_LANGUAGES
    : [language, ...TRANSLATION_LANGUAGES];

  const onGenerate = async () => {
    try {
      await generateEntries({
        noteId: source === MATERIAL_SOURCE ? undefined : source,
        count: selectedCount,
        language,
      });
      setOpen(false);
    } catch {
      // The hook already shows the reason
    }
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <div className="lg:w-[600px] md:w-[500px] sm:w-[400px] w-[300px] max-h-[85vh] overflow-y-auto">
        <div className="flex flex-col w-full justify-center gap-4">
          <Title text="Generate Words" />
          <Separator />
          <p className="text-sm text-neutral-500">
            AI picks words worth learning from the text and adds them with a
            translation, transcription and an example.
          </p>

          <label className="flex flex-col gap-2 text-sm font-medium">
            From
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="bg-gray-100 dark:bg-neutral-700 p-2 rounded-2xl font-normal"
            >
              <option value={MATERIAL_SOURCE}>📄 Material content</option>
              {textNotes.map((note) => (
                <option key={note.id} value={note.id}>
                  {note.type === NoteTypeEnum.summary ? "📚" : "✍️"}{" "}
                  {note.title}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium">
            Translate into
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-100 dark:bg-neutral-700 p-2 rounded-2xl font-normal"
            >
              {languages.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Up to</span>
            <div className="flex gap-2">
              {COUNT_OPTIONS.map((value) => (
                <button
                  key={value}
                  type="button"
                  disabled={value > maxCount && value !== COUNT_OPTIONS[0]}
                  onClick={() => setCount(value)}
                  className={cn(
                    "flex-1 rounded-xl py-2 text-sm font-medium disabled:opacity-40",
                    selectedCount === Math.min(value, maxCount)
                      ? "bg-violet-700 text-white"
                      : "bg-neutral-200 text-neutral-700",
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
            {maxCount < 20 && (
              <span className="text-xs text-neutral-500">
                {maxCount === 0
                  ? "Words limit of this dictionary is reached"
                  : `Only ${maxCount} more ${maxCount === 1 ? "word fits" : "words fit"} into this dictionary`}
              </span>
            )}
          </div>

          <AiUsageHint
            feature={AiFeatureEnum.DictionaryGeneration}
            enabled={open}
          />

          <div className="flex w-full justify-center items-center my-2">
            <div className="flex-1" />
            <div className="flex flex-1 justify-center items-center">
              <Button
                size="lg"
                className="w-50 bg-violet-700 hover:bg-violet-800"
                onClick={onGenerate}
                disabled={
                  generateEntriesIsPending || maxCount === 0 || !isAvailable
                }
              >
                <LuSparkles />
                {generateEntriesIsPending ? "Generating..." : "Generate"}
              </Button>
            </div>
            <div className="flex-1">
              <IsPendingLoader isPending={generateEntriesIsPending} />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
