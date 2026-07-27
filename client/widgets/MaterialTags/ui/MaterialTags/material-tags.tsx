import { FC } from "react";
import { ITagResponse, TagsList } from "@/entities/tag";
import { Subtitle } from "@/shared";
import { ManageTagsList } from "../ManageTagsList/manage-tags-list";

interface SyncTagsType {
  materialId: string;
  materialTags: ITagResponse[] | undefined;
}

export const MaterialTags: FC<SyncTagsType> = ({
  materialId,
  materialTags,
}) => {
  return (
    <div className="flex justify-center items-center gap-2 mt-7">
      <Subtitle text="Tags: " />
      {!materialTags || materialTags.length === 0 ? (
        <ManageTagsList materialId={materialId} materialTags={materialTags} />
      ) : (
        <div className="flex items-center gap-2">
          <TagsList tags={materialTags} />
          <ManageTagsList materialId={materialId} materialTags={materialTags} />
        </div>
      )}
    </div>
  );
};
