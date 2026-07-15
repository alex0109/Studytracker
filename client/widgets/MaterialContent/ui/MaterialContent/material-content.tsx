import { FC } from "react";
import { BlockColumn } from "@/shared/ui";
import { RichTextDocument, MaterialStatusEnum } from "@/entities/material";
import {
  MaterialLink,
  MaterialTextContent,
  MaterialStatus,
} from "@/features/material/update-material/ui";
import { useMaterialUpdate } from "@/features/material/update-material";
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
  const { updateMaterial } = useMaterialUpdate(id);

  const updateStatusHandler = (
    materialId: string,
    status: MaterialStatusEnum,
  ): void => {
    updateMaterial({ id: materialId, dataToUpdate: { status } });
  };

  const updateLinkHandler = (materialId: string, link: string): void => {
    updateMaterial({ id: materialId, dataToUpdate: { link } });
  };

  return (
    <BlockColumn blockStyles="p-[70px] items-start">
      <MaterialLink id={id} link={link} updateLinkHandler={updateLinkHandler} />
      <MaterialTextContent id={id} content={content} />
      <MaterialTags materialId={id} materialTags={tags} />
      <MaterialStatus
        id={id}
        materialStatus={status}
        updateStatusHandler={updateStatusHandler}
      />
    </BlockColumn>
  );
};
