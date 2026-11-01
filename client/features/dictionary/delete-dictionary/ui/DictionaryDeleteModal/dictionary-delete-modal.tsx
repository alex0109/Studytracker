"use client";

import { useTranslation } from "@/shared/i18n";

import { FC } from "react";
import { ConfirmModal } from "@/shared/ui";
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
  const { t } = useTranslation();
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
    <ConfirmModal
      open={open}
      onClose={() => setOpen(false)}
      onConfirm={handleDeleteDictionary}
      pending={deleteDictionaryIsPending}
      title={t("dictionary.deleteTitle")}
      description={t("dictionary.deleteWarning")}
      confirmText={t("common.delete")}
    />
  );
};
