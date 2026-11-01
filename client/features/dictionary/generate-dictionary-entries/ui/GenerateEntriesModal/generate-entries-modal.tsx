"use client";

import { FC, useState } from "react";
import { LuSparkles } from "react-icons/lu";
import { ChoiceGroup, Field, FieldSelect, Modal, Spinner } from "@/shared/ui";
import { Button } from "@/shared/radix-ui";
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
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      size="md"
      icon={<LuSparkles />}
      tone="ai"
      title={t("dictionary.generate.title")}
      description={t("dictionary.generate.text")}
      footer={
        <>
          <Button size="lg" variant="outline" onClick={() => setOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button
            size="lg"
            className="bg-violet-700 text-white hover:bg-violet-800"
            onClick={onGenerate}
            disabled={generateEntriesIsPending || maxCount === 0 || !isAvailable}
          >
            {generateEntriesIsPending ? <Spinner /> : <LuSparkles />}
            {generateEntriesIsPending ? t("ai.generating") : t("ai.generate")}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Field label={t("dictionary.generate.from")}>
          <FieldSelect value={source} onChange={(e) => setSource(e.target.value)}>
            <option value={MATERIAL_SOURCE}>{t("dictionary.generate.materialContent")}</option>
            {textNotes.map((note) => (
              <option key={note.id} value={note.id}>
                {note.type === NoteTypeEnum.summary ? "📚" : "✍️"} {note.title}
              </option>
            ))}
          </FieldSelect>
        </Field>

        <Field label={t("dictionary.generate.translateInto")}>
          <FieldSelect value={languageCode} onChange={(e) => setLanguageCode(e.target.value)}>
            {TRANSLATION_LANGUAGE_CODES.map((code) => (
              <option key={code} value={code}>
                {languageName(code, i18n.language)}
              </option>
            ))}
          </FieldSelect>
        </Field>

        <ChoiceGroup
          label={t("dictionary.generate.upTo")}
          // Fewer free places than the chosen number: the nearest choice stays marked, the hint says how many fit
          value={COUNT_OPTIONS.find((value) => Math.min(value, maxCount) === selectedCount) ?? count}
          onChange={setCount}
          options={COUNT_OPTIONS.map((value) => ({
            value,
            label: value,
            disabled: value > maxCount && value !== COUNT_OPTIONS[0],
          }))}
          hint={
            maxCount < 20 &&
            (maxCount === 0
              ? t("dictionary.generate.full")
              : t("dictionary.generate.fits", { count: maxCount }))
          }
        />

        <AiUsageHint
          feature={AiFeatureEnum.DictionaryGeneration}
          enabled={open}
          className="justify-center"
        />
      </div>
    </Modal>
  );
};
