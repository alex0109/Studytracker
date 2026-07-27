import { FC } from "react";
import { ITagResponse, Tag } from "@/entities/tag";
import { DeleteTagItem } from "../DeleteTagItem/delete-tag-item";
import { Subtitle, Title } from "@/shared/ui";

interface DeleteTagsListProps {
  tags: ITagResponse[] | undefined;
}

export const DeleteTagsList: FC<DeleteTagsListProps> = ({ tags }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <div className="flex w-full justify-center items-center">
        <Title text="Your Tags" />
      </div>
      {!tags || tags.length === 0 ? (
        <div className="flex w-full justify-center items-center">
          <Subtitle text="Add Tag" />
        </div>
      ) : (
        tags.map((item) => (
          <DeleteTagItem
            key={item.id}
            id={item.id}
            name={item.name}
            color={item.color}
          />
        ))
      )}
    </div>
  );
};
