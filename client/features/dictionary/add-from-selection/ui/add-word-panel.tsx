"use client";

import { FC, FormEvent, useEffect, useId, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { LuBookPlus, LuCheck, LuSparkles, LuX } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { flashRange } from "@/shared/lib";
import { useMediaQuery } from "@/shared/hooks/use-media-query";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import type { TextSelectionInfo } from "@/shared/ui";
import {
  IDictionaryResponse,
  PartOfSpeechBadge,
  PartOfSpeechEnum,
  useDictionaryAll,
} from "@/entities/dictionary";
import { AiFeatureEnum, AiUsageHint } from "@/entities/ai";
import { existingEntryIdOf, useAddWord, useWordLookup } from "../hooks/useAddWord";

interface AddWordPanelProps {
  materialId: string;
  selection: TextSelectionInfo;
  onClose: () => void;
  onOpenDictionary?: (dictionary: IDictionaryResponse) => void;
}

const WIDTH = 352;

const field =
  "w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-neutral-500";

// Saving a word never touches the text: the material stays as it is and is not autosaved
export const AddWordPanel: FC<AddWordPanelProps> = ({ materialId, selection, onClose, onOpenDictionary }) => {
  const { t } = useTranslation();
  const ids = useId();
  const sheet = useMediaQuery("(max-width: 639px)");
  const panelRef = useRef<HTMLFormElement>(null);
  const { dictionariesData } = useDictionaryAll(materialId);
  const { lookup, lookupIsPending } = useWordLookup();
  const { createEntry, updateExample, createDictionary, isPending } = useAddWord(materialId);

  const [chosenDictionaryId, setDictionaryId] = useState("");
  const [term, setTerm] = useState(selection.text);
  const [example, setExample] = useState(selection.sentence);
  const [translation, setTranslation] = useState("");
  const [transcription, setTranscription] = useState("");
  const [extra, setExtra] = useState<{
    partOfSpeech?: PartOfSpeechEnum;
    grammarInfo?: string;
    exampleTranslation?: string;
  }>({});
  const [duplicateId, setDuplicateId] = useState<string | null>(null);

  // The first dictionary of the material is the usual target
  const dictionaryId = chosenDictionaryId || dictionariesData?.[0]?.id || "";

  const dictionary = dictionariesData?.find((item) => item.id === dictionaryId);

  // "Already in a dictionary of this material", case does not matter
  const alreadyIn = useMemo(() => {
    const wanted = term.trim().toLowerCase();
    return dictionariesData?.find((item) =>
      item.entries?.some((entry) => entry.term.trim().toLowerCase() === wanted),
    );
  }, [dictionariesData, term]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    const onDown = (event: PointerEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [onClose]);

  const fill = async () => {
    if (!dictionaryId || !term.trim()) return;
    try {
      const result = await lookup({ dictionaryId, term: term.trim(), sentence: example.trim() || undefined });
      setTranslation(result.translation);
      setTranscription(result.transcription ?? "");
      setExtra({
        partOfSpeech: result.partOfSpeech ?? undefined,
        grammarInfo: result.grammarInfo ?? undefined,
        exampleTranslation: result.exampleTranslation ?? undefined,
      });
      setDuplicateId(result.existingEntryId);
    } catch {
      // The hook already said what went wrong
    }
  };

  const saved = (
    target: IDictionaryResponse | undefined,
    titleKey: "dictionary.fromReading.added" | "dictionary.fromReading.exampleUpdated",
  ) => {
    flashRange(selection.range);
    toast({
      title: `✅${t(titleKey)}`,
      variant: "success",
      durationMs: 6000,
      action:
        target && onOpenDictionary
          ? { label: t("dictionary.fromReading.open"), onClick: () => onOpenDictionary(target) }
          : undefined,
    });
    onClose();
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!dictionaryId || !term.trim() || !translation.trim()) return;

    try {
      await createEntry({
        dictionaryId,
        body: {
          term: term.trim(),
          translation: translation.trim(),
          transcription: transcription.trim() || undefined,
          partOfSpeech: extra.partOfSpeech,
          grammarInfo: extra.grammarInfo,
          example: example.trim() || undefined,
          exampleTranslation: extra.exampleTranslation,
        },
      });
      saved(dictionary, "dictionary.fromReading.added");
    } catch (error) {
      setDuplicateId(existingEntryIdOf(error));
    }
  };

  const replaceExample = async () => {
    if (!duplicateId || !example.trim()) return;
    try {
      await updateExample({
        entryId: duplicateId,
        dictionaryId,
        example: example.trim(),
        exampleTranslation: extra.exampleTranslation,
      });
      saved(dictionary, "dictionary.fromReading.exampleUpdated");
    } catch {
      // The hook already said what went wrong
    }
  };

  const createList = async () => {
    try {
      const created = await createDictionary(t("dictionary.fromReading.defaultTitle"));
      setDictionaryId(created.id);
    } catch {
      // The hook already said what went wrong
    }
  };

  // Next to the selection on wide screens, never over it: below when there is room, else growing
  // upwards from it. A sheet at the bottom on phones
  const roomBelow = window.innerHeight - selection.rect.bottom - 24;
  const roomAbove = selection.rect.top - 24;
  const left = Math.min(
    Math.max(selection.rect.left + selection.rect.width / 2 - WIDTH / 2, 12),
    window.innerWidth - WIDTH - 12,
  );
  const style = sheet
    ? undefined
    : roomBelow >= 440 || roomBelow >= roomAbove
      ? { width: WIDTH, left, top: selection.rect.bottom + 12, maxHeight: roomBelow }
      : { width: WIDTH, left, bottom: window.innerHeight - selection.rect.top + 12, maxHeight: roomAbove };

  return (
    <motion.form
      ref={panelRef}
      onSubmit={submit}
      role="dialog"
      aria-label={t("dictionary.fromReading.title")}
      initial={sheet ? { y: "100%" } : { opacity: 0, y: 6, scale: 0.98 }}
      animate={sheet ? { y: 0 } : { opacity: 1, y: 0, scale: 1 }}
      exit={sheet ? { y: "100%" } : { opacity: 0, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
      style={style}
      className={
        sheet
          ? "fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col gap-3 overflow-y-auto rounded-t-3xl border-t border-neutral-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl dark:border-neutral-700 dark:bg-neutral-900"
          : "fixed z-50 flex flex-col gap-3 overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-4 shadow-2xl dark:border-neutral-700 dark:bg-neutral-900"
      }
    >
      <header className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <LuBookPlus aria-hidden className="text-emerald-600" />
          {t("dictionary.fromReading.title")}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("common.close")}
          className="rounded-lg p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
        >
          <LuX aria-hidden />
        </button>
      </header>

      {dictionariesData && dictionariesData.length === 0 ? (
        <div className="flex flex-col gap-2 rounded-xl bg-neutral-50 p-3 text-sm dark:bg-neutral-800/60">
          <p className="text-neutral-600 dark:text-neutral-300">{t("dictionary.fromReading.noDictionary")}</p>
          <Button type="button" size="sm" variant="outline" onClick={createList} disabled={isPending} className="self-start">
            {t("dictionary.fromReading.createDictionary")}
          </Button>
        </div>
      ) : (
        <label htmlFor={`${ids}-dictionary`} className="flex flex-col gap-1 text-xs font-medium text-neutral-500">
          {t("dictionary.fromReading.dictionary")}
          <select
            id={`${ids}-dictionary`}
            className={field}
            value={dictionaryId}
            onChange={(event) => setDictionaryId(event.target.value)}
          >
            {dictionariesData?.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
      )}

      <label htmlFor={`${ids}-term`} className="flex flex-col gap-1 text-xs font-medium text-neutral-500">
        {t("dictionary.fromReading.term")}
        <input
          id={`${ids}-term`}
          className={field}
          value={term}
          maxLength={200}
          onChange={(event) => {
            setTerm(event.target.value);
            setDuplicateId(null);
          }}
        />
      </label>
      {alreadyIn && (
        <p className="-mt-1 flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400">
          <LuCheck aria-hidden />
          {t("dictionary.fromReading.alreadyIn", { dictionary: alreadyIn.title })}
        </p>
      )}

      <label htmlFor={`${ids}-example`} className="flex flex-col gap-1 text-xs font-medium text-neutral-500">
        {t("dictionary.fromReading.example")}
        <textarea
          id={`${ids}-example`}
          className={`${field} min-h-16 resize-none`}
          value={example}
          maxLength={500}
          onChange={(event) => setExample(event.target.value)}
        />
      </label>

      <div className="flex flex-col gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={fill}
          disabled={!dictionaryId || !term.trim() || lookupIsPending}
          className="self-start"
        >
          <LuSparkles aria-hidden className={lookupIsPending ? "animate-pulse" : undefined} />
          {lookupIsPending ? t("dictionary.fromReading.filling") : t("dictionary.fromReading.fill")}
        </Button>
        <AiUsageHint feature={AiFeatureEnum.WordLookup} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label htmlFor={`${ids}-translation`} className="flex flex-col gap-1 text-xs font-medium text-neutral-500">
          {t("dictionary.fromReading.translation")}
          <input
            id={`${ids}-translation`}
            className={field}
            value={translation}
            maxLength={200}
            required
            onChange={(event) => setTranslation(event.target.value)}
          />
        </label>
        <label htmlFor={`${ids}-transcription`} className="flex flex-col gap-1 text-xs font-medium text-neutral-500">
          {t("dictionary.fromReading.transcription")}
          <input
            id={`${ids}-transcription`}
            className={field}
            value={transcription}
            maxLength={200}
            onChange={(event) => setTranscription(event.target.value)}
          />
        </label>
      </div>

      {(extra.partOfSpeech || extra.grammarInfo) && (
        <p className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
          <PartOfSpeechBadge partOfSpeech={extra.partOfSpeech} />
          {extra.grammarInfo}
        </p>
      )}

      {duplicateId ? (
        <div className="flex flex-col gap-2 rounded-xl bg-amber-50 p-3 text-sm dark:bg-amber-950/40">
          <p className="text-amber-800 dark:text-amber-300">{t("dictionary.fromReading.duplicate")}</p>
          <Button type="button" size="sm" onClick={replaceExample} disabled={isPending || !example.trim()} className="self-start">
            {t("dictionary.fromReading.updateExample")}
          </Button>
        </div>
      ) : (
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" size="sm" disabled={isPending || !dictionaryId || !term.trim() || !translation.trim()}>
            {t("common.save")}
          </Button>
        </div>
      )}
    </motion.form>
  );
};
