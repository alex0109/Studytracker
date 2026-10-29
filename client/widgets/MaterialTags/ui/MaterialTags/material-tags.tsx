"use client";

import { FC } from "react";
import { useTranslation } from "@/shared/i18n";
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
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Subtitle text={`${t("tags.label")}:`} />
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
