import { FC } from "react";
import { ITagResponse, Tag } from "@/entities/tag";

interface TagsListProps {
  tags: ITagResponse[] | undefined;
}

export const TagsList: FC<TagsListProps> = ({ tags }) => {
  return (
    <div className="flex flex-wrap gap-2 p-2 m-2 ">
      {!tags || tags.length === 0 ? (
        <div className="w-full">
          <p className="text-center">No tags</p>
        </div>
      ) : (
        tags.map((item) => (
          <Tag key={item.id} id={item.id} name={item.name} color={item.color} />
        ))
      )}
    </div>
  );
};
