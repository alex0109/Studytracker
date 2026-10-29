"use client";

import { FC, useState } from "react";
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
  defaultTranslationCode,
  languageName,
  TRANSLATION_LANGUAGE_CODES,
} from "../../lib/translation-languages";
import { useTranslation } from "@/shared/i18n";

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
  const { t, i18n } = useTranslation();
  const [source, setSource] = useState(MATERIAL_SOURCE);
  const [count, setCount] = useState(10);
  const [languageCode, setLanguageCode] = useState(() =>
    defaultTranslationCode(i18n.language),
  );

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

  const onGenerate = async () => {
    try {
      await generateEntries({
        noteId: source === MATERIAL_SOURCE ? undefined : source,
        count: selectedCount,
        language: languageName(languageCode, "en"),
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
          <Title text={t("dictionary.generate.title")} />
          <Separator />
          <p className="text-sm text-neutral-500">{t("dictionary.generate.text")}</p>

          <label className="flex flex-col gap-2 text-sm font-medium">
            {t("dictionary.generate.from")}
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="bg-neutral-100 dark:bg-neutral-700 p-2 rounded-2xl font-normal"
            >
              <option value={MATERIAL_SOURCE}>{t("dictionary.generate.materialContent")}</option>
              {textNotes.map((note) => (
                <option key={note.id} value={note.id}>
                  {note.type === NoteTypeEnum.summary ? "📚" : "✍️"}{" "}
                  {note.title}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium">
            {t("dictionary.generate.translateInto")}
            <select
              value={languageCode}
              onChange={(e) => setLanguageCode(e.target.value)}
              className="bg-neutral-100 dark:bg-neutral-700 p-2 rounded-2xl font-normal"
            >
              {TRANSLATION_LANGUAGE_CODES.map((code) => (
                <option key={code} value={code}>
                  {languageName(code, i18n.language)}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">{t("dictionary.generate.upTo")}</span>
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
                      : "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200",
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
            {maxCount < 20 && (
              <span className="text-xs text-neutral-500">
                {maxCount === 0
                  ? t("dictionary.generate.full")
                  : t("dictionary.generate.fits", { count: maxCount })}
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
                {generateEntriesIsPending ? t("ai.generating") : t("ai.generate")}
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
