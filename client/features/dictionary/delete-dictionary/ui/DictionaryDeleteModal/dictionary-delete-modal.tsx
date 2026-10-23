"use client";

import { FC } from "react";
import { Modal, Title } from "@/shared/ui";
import { Button } from "@/shared/radix-ui";
import { useDictionaryDelete } from "../../hooks/useDictionaryDelete";

interface DictionaryDeleteModalProps {
  materialId: string;
  dictionaryId: string;
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  onDeleted?: () => void;
}

export const DictionaryDeleteModal: FC<DictionaryDeleteModalProps> = ({
  materialId,
  dictionaryId,
  open,
  setOpen,
  onDeleted,
}) => {
  const { deleteDictionary, deleteDictionaryIsPending } = useDictionaryDelete(
    materialId,
    dictionaryId,
  );

  const handleDeleteDictionary = () => {
    deleteDictionary(undefined, {
      onSuccess: () => {
        setOpen(false);
        onDeleted?.();
      },
    });
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <div className="flex flex-col w-[200px] h-[200px] justify-center items-center gap-1">
        <Title text="Are you sure?" />
        <Button
          size="lg"
          variant="destructive"
          disabled={deleteDictionaryIsPending}
          onClick={() => handleDeleteDictionary()}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
};
