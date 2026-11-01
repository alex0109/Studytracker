"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/shared/ui";
import { useMaterialDelete } from "../../hooks/useMaterialDelete";
import { useTranslation } from "@/shared/i18n";

interface MaterialDeleteModalType {
  id: string;
  open: boolean;
  setOpen: (isOpen: boolean) => void;
}

export const MaterialDeleteModal: FC<MaterialDeleteModalType> = ({
  id,
  open,
  setOpen,
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const { deleteMaterial } = useMaterialDelete(id);

  // Always to the list, and replacing the page: "back" led wherever the visit began (often the
  // home page), and the deleted material stayed in the history only to answer 404
  const handleDeleteMaterial = () => {
    deleteMaterial();
    router.replace("/materials");
  };
  return (
    <ConfirmModal
      open={open}
      onClose={() => setOpen(false)}
      onConfirm={handleDeleteMaterial}
      title={t("materials.deleteTitle")}
      description={t("materials.deleteWarning")}
      confirmText={t("common.delete")}
    />
  );
};
