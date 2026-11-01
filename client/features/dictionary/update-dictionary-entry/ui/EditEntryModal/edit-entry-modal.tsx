"use client";

import { useTranslation } from "@/shared/i18n";

import { FC } from "react";
import { LuPencil } from "react-icons/lu";
import { Modal, Spinner } from "@/shared/ui";
import { Button, toast } from "@/shared/radix-ui";
import {
  DictionaryEntryForm,
  IDictionaryEntryForm,
  IDictionaryEntryResponse,
  toEntryForm,
  toEntryUpdate,
} from "@/entities/dictionary";
import { useDictionaryEntryUpdate } from "../../hooks/useDictionaryEntryUpdate";

interface EditEntryModalProps {
  dictionaryId: string;
  entry?: IDictionaryEntryResponse;
  open: boolean;
  setOpen: (isOpen: boolean) => void;
}

export const EditEntryModal: FC<EditEntryModalProps> = ({
  dictionaryId,
  entry,
  open,
  setOpen,
}) => {
  const { t } = useTranslation();
  const { updateEntry, updateEntryIsPending } = useDictionaryEntryUpdate(
    dictionaryId,
    entry?.id,
  );

  const onFormSubmit = (values: IDictionaryEntryForm) => {
    if (!entry) return;

    updateEntry(
      { entryId: entry.id, dataToUpdate: toEntryUpdate(values) },
      {
        onSuccess: () => {
          setOpen(false);
          toast({
            title: `✅${t("toasts.wordUpdated")}`,
            variant: "success",
          });
        },
      },
    );
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      size="lg"
      icon={<LuPencil />}
      title={t("dictionary.editWord")}
      description={entry?.term}
      footer={
        <>
          <Button size="lg" variant="outline" onClick={() => setOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button size="lg" type="submit" form="edit-dictionary-entry" disabled={!entry || updateEntryIsPending}>
            {updateEntryIsPending && <Spinner />}
            {t("common.save")}
          </Button>
        </>
      }
    >
      {entry && (
        <DictionaryEntryForm
          key={`${entry.id}-${entry.updatedAt}`}
          id="edit-dictionary-entry"
          defaultValues={toEntryForm(entry)}
          onSubmit={onFormSubmit}
        />
      )}
    </Modal>
  );
};
