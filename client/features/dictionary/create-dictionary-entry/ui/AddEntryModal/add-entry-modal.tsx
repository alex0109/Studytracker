"use client";

import { useTranslation } from "@/shared/i18n";

import { FC } from "react";
import { LuBookPlus } from "react-icons/lu";
import { Modal, Spinner } from "@/shared/ui";
import { Button } from "@/shared/radix-ui";
import {
  DictionaryEntryForm,
  IDictionaryEntryForm,
  toEntryCreate,
} from "@/entities/dictionary";
import { useDictionaryEntryCreate } from "../../hooks/useDictionaryEntryCreate";

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
      <DictionaryEntryForm id="add-dictionary-entry" onSubmit={onFormSubmit} />
    </Modal>
  );
};
