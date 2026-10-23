"use client";

import { FC } from "react";
import { Modal, Title } from "@/shared/ui";
import { Separator, toast } from "@/shared/radix-ui";
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
            title: "✅Word has been updated!",
            variant: "success",
          });
        },
      },
    );
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <div className="lg:w-[800px] md:w-[600px] sm:w-[400px] w-[300px] max-h-[80vh] overflow-y-auto">
        <div className="flex flex-col w-full justify-center">
          <Title text="Edit word" />
          <Separator className="mb-3" />
          {entry && (
            <DictionaryEntryForm
              key={`${entry.id}-${entry.updatedAt}`}
              defaultValues={toEntryForm(entry)}
              submitText="Save"
              isPending={updateEntryIsPending}
              onSubmit={onFormSubmit}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};
