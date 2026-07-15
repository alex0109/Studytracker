"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { CustomButton, Modal, Title } from "@/shared/ui";
import { useMaterialDelete } from "../../hooks/useMaterialDelete";

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
  const router = useRouter();

  const { deleteMaterial } = useMaterialDelete(id);

  const handleDeleteMaterial = () => {
    deleteMaterial();
    router.back();
  };
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <div className="flex flex-col w-[200px] h-[200px] justify-center items-center gap-1">
        <Title text="Are you sure?" />
        <CustomButton title="Delete" onClick={() => handleDeleteMaterial()} />
      </div>
    </Modal>
  );
};
