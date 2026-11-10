"use client";

import { FC, useState } from "react";
import { LuTrash2 } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { ConfirmModal } from "@/shared/ui";
import { useTranslation } from "@/shared/i18n";
import { useQuestionDelete } from "../hooks/useQuestionDelete";

interface DeleteQuestionButtonProps {
  materialId: string;
  id: string;
}

// Quiet and asked once more: a deleted question takes its progress with it
export const DeleteQuestionButton: FC<DeleteQuestionButtonProps> = ({ materialId, id }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { deleteQuestion } = useQuestionDelete(materialId);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40"
      >
        <LuTrash2 aria-hidden /> {t("questions.editor.delete")}
      </Button>
      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          setOpen(false);
          deleteQuestion(id);
        }}
        tone="danger"
        title={t("questions.editor.deleteTitle")}
        description={t("questions.editor.deleteText")}
        confirmText={t("common.delete")}
      />
    </>
  );
};
