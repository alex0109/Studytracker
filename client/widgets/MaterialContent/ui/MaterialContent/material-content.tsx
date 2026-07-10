import { FC } from "react";
import { BlockColumn } from "@/shared/ui";
import { RichTextDocument, MaterialStatusEnum } from "@/entities/material";
import {
  MaterialLink,
  MaterialTextContent,
  MaterialTags,
  MaterialStatus,
} from "@/features/material/update-material/ui";
import { useMaterialUpdate } from "@/features/material/update-material";

interface MaterialContentType {
  id: string;
  link: string | undefined;
  content: RichTextDocument | undefined;
  tags: string[] | undefined;
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

  const updateTagsHandler = (materialId: string, tags: string[]): void => {};

  const updateStatusHandler = (
    materialId: string,
    status: MaterialStatusEnum,
  ): void => {
    updateMaterial({ id: materialId, dataToUpdate: { status } });
  };

  const updateLinkHandler = (materialId: string, link: string): void => {
    updateMaterial({ id: materialId, dataToUpdate: { link } });
  };

  const updateContentHandler = (
    materialId: string,
    content: RichTextDocument,
  ): void => {
    updateMaterial({ id: materialId, dataToUpdate: { content } });
  };

  return (
    <BlockColumn blockStyles="p-[70px] items-start">
      <MaterialLink id={id} link={link} updateLinkHandler={updateLinkHandler} />
      <MaterialTextContent
        id={id}
        content={content}
        updateDescriptionHandler={updateContentHandler}
      />
      <MaterialTags
        id={id}
        materialTags={tags}
        updateTagsHandler={updateTagsHandler}
      />
      <MaterialStatus
        id={id}
        materialStatus={status}
        updateStatusHandler={updateStatusHandler}
      />
    </BlockColumn>
  );
};
