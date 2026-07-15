"use client";

import { AddTag } from "@/features/tag/create-tag";
import { BlockColumn, Title } from "@/shared/ui";
import { AddMaterial } from "@/features/material/create-material/ui";
import { useTagsAll } from "@/entities/tag";
import { DeleteTagsList } from "@/features/tag/delete-tag";

export const AddTagAndMaterial = () => {
  const { tagsData } = useTagsAll();
  return (
    <BlockColumn>
      <div className="flex w-full h-full">
        <div className="w-full h-full rounded-xl flex-1 flex-col ">
          <DeleteTagsList tags={tagsData} />
          <div className="w-full flex justify-center items-center p-2">
            <AddTag />
          </div>
        </div>
        <div className="flex flex-1 w-full border-l border-neutral-300 justify-center items-center">
          <div>
            <Title text="Add new material" />
            <div className="flex justify-center items-center">
              <AddMaterial />
            </div>
          </div>
        </div>
      </div>
    </BlockColumn>
  );
};
