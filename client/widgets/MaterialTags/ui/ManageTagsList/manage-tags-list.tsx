"use client";

import { FC, useState } from "react";
import { Button } from "@/shared/radix-ui";
import { Modal, Title } from "@/shared/ui";
import { ITagResponse, useTagsAll } from "@/entities/tag";
import { ManageTagItem } from "../ManageTagItem/manage-tag-item";
import { useAddTagToMaterial } from "@/features/material/add-tag-to-material";
import { useDeleteTagFromMaterial } from "@/features/material/delete-tag-from-material";

interface SelectTagProps {
  materialId: string;
  materialTags: ITagResponse[] | undefined;
}

export const ManageTagsList: FC<SelectTagProps> = ({
  materialId,
  materialTags = [],
}) => {
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
        Manage Tags +
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="w-[400px]">
          <Title text="Add tag" />

          <div className="flex flex-wrap gap-2 p-2 m-2">
            {!tagsData || tagsData.length === 0 ? (
              <div className="w-full">
                <p className="text-center">No available tags</p>
              </div>
            ) : (
              tagsData?.map((tag) => (
                <ManageTagItem
                  key={tag.id}
                  id={tag.id}
                  name={tag.name}
                  color={tag.color}
                  selected={materialTags.some((item) => item.id === tag.id)}
                  onAdd={handleAdd}
                  onRemove={handleRemove}
                />
              ))
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};
