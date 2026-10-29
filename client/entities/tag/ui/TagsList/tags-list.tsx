"use client";

import { FC } from "react";
import { useTranslation } from "@/shared/i18n";
import { ITagResponse, Tag } from "@/entities/tag";

interface TagsListProps {
  tags: ITagResponse[] | undefined;
}

export const TagsList: FC<TagsListProps> = ({ tags }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap gap-2 p-2 m-2 ">
      {!tags || tags.length === 0 ? (
        <div className="w-full">
          <p className="text-center">{t("tags.none")}</p>
        </div>
      ) : (
        tags.map((item) => (
          <Tag key={item.id} id={item.id} name={item.name} color={item.color} />
        ))
      )}
    </div>
  );
};
