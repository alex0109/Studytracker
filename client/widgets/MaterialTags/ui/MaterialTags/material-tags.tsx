"use client";

import { FC } from "react";
import { useTranslation } from "@/shared/i18n";
import { ITagResponse, TagsList } from "@/entities/tag";
import { Subtitle } from "@/shared";
import { getTextColor } from "@/shared/lib/get-text-color";
import { ManageTagsList } from "../ManageTagsList/manage-tags-list";

interface SyncTagsType {
  materialId: string;
  materialTags: ITagResponse[] | undefined;
  // Small chips without a label, for a list of properties
  compact?: boolean;
}

export const MaterialTags: FC<SyncTagsType> = ({
  materialId,
  materialTags,
  compact = false,
}) => {
  const { t } = useTranslation();

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-1.5">
        {materialTags?.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex h-7 items-center rounded-full px-2.5 text-xs font-medium"
            style={{ backgroundColor: tag.color, color: getTextColor(tag.color) }}
          >
            {tag.name}
          </span>
        ))}
        <ManageTagsList materialId={materialId} materialTags={materialTags} compact />
      </div>
    );
  }

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
