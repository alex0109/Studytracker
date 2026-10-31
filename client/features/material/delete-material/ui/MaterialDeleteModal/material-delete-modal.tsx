"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { Modal, Title } from "@/shared/ui";
import { useMaterialDelete } from "../../hooks/useMaterialDelete";
import { Button } from "@/shared/radix-ui";
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

  const handleDeleteMaterial = () => {
    deleteMaterial();
    router.back();
  };
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <div className="flex flex-col w-[240px] min-h-[200px] justify-center items-center gap-3 text-center">
        <Title text={t("common.areYouSure")} />
        <p className="text-sm text-neutral-500">{t("materials.deleteWarning")}</p>
        <Button
          size="lg"
          variant="destructive"
          onClick={() => handleDeleteMaterial()}
        >
          {t("common.delete")}
        </Button>
      </div>
    </Modal>
  );
};
