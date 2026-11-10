"use client";

import { FC, useState } from "react";
import { LuBookCopy, LuPencil, LuPlus } from "react-icons/lu";
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
  // A small chip or pencil in a list of properties instead of the big button
  compact?: boolean;
}

export const ManageTagsList: FC<SelectTagProps> = ({
  materialId,
  materialTags = [],
  compact = false,
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
      {compact ? (
        materialTags.length === 0 ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-7 items-center gap-1 rounded-full border border-dashed border-neutral-300 px-2.5 text-xs font-medium text-neutral-500 transition hover:border-neutral-500 hover:text-neutral-800 dark:border-neutral-700 dark:hover:border-neutral-500 dark:hover:text-neutral-200"
          >
            <LuPlus aria-hidden /> {t("tags.add")}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t("tags.manage")}
            title={t("tags.manage")}
            className="inline-flex size-7 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-200/70 hover:text-neutral-800 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          >
            <LuPencil aria-hidden className="size-3.5" />
          </button>
        )
      ) : (
        <Button size="lg" className="rounded-2xl" onClick={() => setOpen(true)}>
          {t("tags.manage")} +
        </Button>
      )}

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
