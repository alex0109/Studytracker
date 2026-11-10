"use client";

import { FC, useState } from "react";
import { LuBookCopy } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { Modal } from "@/shared/ui";
import { ITagResponse, useTagsAll } from "@/entities/tag";
import { ManageTagItem } from "../ManageTagItem/manage-tag-item";
import { useAddTagToMaterial } from "@/features/material/add-tag-to-material";
import { useDeleteTagFromMaterial } from "@/features/material/delete-tag-from-material";
import { AddTag } from "@/features/tag/create-tag";
import { useTranslation } from "@/shared/i18n";

interface SelectTagProps {
  materialId: string;
  materialTags: ITagResponse[] | undefined;
}

export const ManageTagsList: FC<SelectTagProps> = ({
  materialId,
  materialTags = [],
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const { tagsData } = useTagsAll();

  const { addTagToMaterial } = useAddTagToMaterial(materialId);

  const { deleteTagFromMaterial } = useDeleteTagFromMaterial(materialId);

  const handleAdd = (tagId: string) => {
    addTagToMaterial({
      materialId,
      tagId,
    });
  };

  const handleRemove = (tagId: string) => {
    deleteTagFromMaterial({
      materialId,
      tagId,
    });
  };

  return (
    <>
      <Button size="lg" className="rounded-2xl" onClick={() => setOpen(true)}>
        {t("tags.manage")} +
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        icon={<LuBookCopy />}
        title={t("tags.addToMaterial")}
        description={t("tags.addToMaterialText")}
        footer={<AddTag />}
      >
        {!tagsData || tagsData.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-neutral-200 p-4 text-center text-sm text-neutral-500 dark:border-neutral-800">
            {t("tags.noneYet")}
          </p>
        ) : (
          <div className="flex flex-wrap justify-center gap-2">
            {tagsData.map((tag) => (
              <ManageTagItem
                key={tag.id}
                id={tag.id}
                name={tag.name}
                color={tag.color}
                selected={materialTags.some((item) => item.id === tag.id)}
                onAdd={handleAdd}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </Modal>
    </>
  );
};
