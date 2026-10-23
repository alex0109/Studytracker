"use client";

import { FC } from "react";
import { Modal, Title } from "@/shared/ui";
import { Separator } from "@/shared/radix-ui";
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
  const { createEntry, createEntryIsPending } =
    useDictionaryEntryCreate(dictionaryId);

  const onFormSubmit = (values: IDictionaryEntryForm) => {
    createEntry(toEntryCreate(values));
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <div className="lg:w-[800px] md:w-[600px] sm:w-[400px] w-[300px] max-h-[80vh] overflow-y-auto">
        <div className="flex flex-col w-full justify-center">
          <Title text="Add new word" />
          <Separator className="mb-3" />
          <DictionaryEntryForm
            submitText="Add"
            isPending={createEntryIsPending}
            resetOnSubmit
            onSubmit={onFormSubmit}
          />
        </div>
      </div>
    </Modal>
  );
};
