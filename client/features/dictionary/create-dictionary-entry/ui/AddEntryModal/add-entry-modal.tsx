"use client";

import { useTranslation } from "@/shared/i18n";

import { FC } from "react";
import Link from "next/link";
import { LuBookPlus, LuSparkles } from "react-icons/lu";
import { Modal, Spinner } from "@/shared/ui";
import { Button } from "@/shared/radix-ui";
import {
  DictionaryEntryForm,
  IDictionaryEntryForm,
  toEntryCreate,
} from "@/entities/dictionary";
import { useDictionaryEntryCreate } from "../../hooks/useDictionaryEntryCreate";
import { useTranslationSuggestion } from "../../hooks/useTranslationSuggestion";

interface AddEntryModalProps {
  dictionaryId: string;
  open: boolean;
  setOpen: (isOpen: boolean) => void;
}

export const AddEntryModal: FC<AddEntryModalProps> = ({
  dictionaryId,
  open,
  setOpen,
}) => {
  const { t } = useTranslation();
  const { createEntry, createEntryIsPending } =
    useDictionaryEntryCreate(dictionaryId);
  const autoTranslate = useTranslationSuggestion();

  const onFormSubmit = (values: IDictionaryEntryForm) => {
    // Open with a spinner until the word is saved, so the click shows and can't repeat
    createEntry(toEntryCreate(values), { onSuccess: () => setOpen(false) });
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      size="lg"
      icon={<LuBookPlus />}
      title={t("dictionary.addWordTitle")}
      description={t("dictionary.addWordText")}
      footer={
        <>
          <Button size="lg" variant="outline" onClick={() => setOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button size="lg" type="submit" form="add-dictionary-entry" disabled={createEntryIsPending}>
            {createEntryIsPending && <Spinner />}
            {t("common.add")}
          </Button>
        </>
      }
    >
      <DictionaryEntryForm
        id="add-dictionary-entry"
        onSubmit={onFormSubmit}
        suggestTranslation={autoTranslate.enabled ? autoTranslate.suggest : undefined}
        translationHint={
          autoTranslate.showPlusHint && (
            <Link href="/limits#plans" className="flex items-center gap-1 text-xs text-neutral-500 hover:text-violet-700 dark:hover:text-violet-300">
              <LuSparkles aria-hidden className="text-violet-500" /> {t("dictionary.form.autoTranslatePlus")}
            </Link>
          )
        }
      />
    </Modal>
  );
};
