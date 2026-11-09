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
  open: boolean;
  setOpen: (isOpen: boolean) => void;
}

const COUNT_OPTIONS = [5, 10, 15, 20];
const MATERIAL_SOURCE = "material";

export const GenerateEntriesModal: FC<GenerateEntriesModalProps> = ({
  dictionaryId,
  materialId,
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

  const onGenerate = async () => {
    try {
      await generateEntries({
        noteId: source === MATERIAL_SOURCE ? undefined : source,
        count,
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
            disabled={generateEntriesIsPending || !isAvailable}
          >
            {generateEntriesIsPending ? <Spinner /> : <LuSparkles />}
            {generateEntriesIsPending ? t("ai.generating") : t("ai.generate")}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Field label={t("dictionary.generate.from")}>
          <FieldSelect
            value={source}
            onValueChange={setSource}
            options={[
              { value: MATERIAL_SOURCE, label: t("dictionary.generate.materialContent") },
              ...textNotes.map((note) => ({
                value: note.id,
                label: `${note.type === NoteTypeEnum.summary ? "📚" : "✍️"} ${note.title}`,
              })),
            ]}
          />
        </Field>

        <Field label={t("dictionary.generate.translateInto")}>
          <FieldSelect
            value={languageCode}
            onValueChange={setLanguageCode}
            options={TRANSLATION_LANGUAGE_CODES.map((code) => ({
              value: code,
              label: languageName(code, i18n.language),
              lang: code,
            }))}
          />
        </Field>

        <ChoiceGroup
          label={t("dictionary.generate.upTo")}
          value={count}
          onChange={setCount}
          options={COUNT_OPTIONS.map((value) => ({ value, label: value }))}
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
