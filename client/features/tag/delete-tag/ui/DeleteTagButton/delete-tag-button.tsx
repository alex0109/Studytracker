"use client";

import { FC, useState } from "react";
import { LuTrash2 } from "react-icons/lu";
import { ConfirmModal } from "@/shared/ui";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { useTagDelete } from "../../hooks/useTagDelete";

interface DeleteTagButtonProps {
  id: string;
  name: string;
  className?: string;
}

// Deletes the tag everywhere, not only from one material, so it asks first
export const DeleteTagButton: FC<DeleteTagButtonProps> = ({ id, name, className }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { deleteTag, deleteTagIsPending } = useTagDelete(id);

  return (
    <>
      <button
        type="button"
        aria-label={t("tags.deleteNamed", { name })}
        title={t("tags.delete")}
        onClick={() => setOpen(true)}
        className={cn("flex items-center justify-center rounded-full p-1 opacity-60 transition hover:opacity-100", className)}
      >
        <LuTrash2 aria-hidden className="size-3.5" />
      </button>
      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => deleteTag(undefined, { onSuccess: () => setOpen(false) })}
        pending={deleteTagIsPending}
        title={t("tags.deleteTitle", { name })}
        description={t("tags.deleteText")}
        confirmText={t("common.delete")}
      />
    </>
  );
};
