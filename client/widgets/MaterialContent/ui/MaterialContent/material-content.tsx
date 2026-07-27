import { FC } from "react";
import { BlockColumn } from "@/shared/ui";
import { RichTextDocument, MaterialStatusEnum } from "@/entities/material";
import {
  MaterialLink,
  MaterialTextContent,
  MaterialStatus,
} from "@/features/material/update-material/ui";
import { ITagResponse } from "@/entities/tag";
import { MaterialTags } from "@/widgets/MaterialTags";

interface MaterialContentType {
  id: string;
  link: string | undefined;
  content: RichTextDocument | undefined;
  tags: ITagResponse[] | undefined;
  status: MaterialStatusEnum;
}

export const MaterialContent: FC<MaterialContentType> = ({
  id,
  link,
  content,
  tags,
  status,
}) => {
  return (
    <BlockColumn blockStyles="p-[70px] items-start">
      <MaterialLink id={id} link={link} />
      <MaterialTextContent id={id} content={content} />
      <MaterialTags materialId={id} materialTags={tags} />
      <MaterialStatus id={id} materialStatus={status} />
    </BlockColumn>
  );
};
