import BlockColumn from "@/shared/components/block-column";
import { FC } from "react";
import MaterialLink from "./components/link.component";
import MaterialDescription from "./components/description.component";
import MaterialTags from "./components/tags.component";
import MaterialStatus from "./components/status.component";
import { MaterialStatusEnum, RichTextDocument } from "@/app/types/types";

interface MaterialsContentType {
  id: string;
  link: string | undefined;
  description: RichTextDocument | undefined;
  tags: string[] | undefined;
  status: MaterialStatusEnum;
  updateLinkHandler: (id: string, link: string) => void;
  updateDescriptionHandler: (id: string, description: RichTextDocument) => void;
  updateTagsHandler: (id: string, tags: string[]) => void;
  updateStatusHandler: (id: string, status: MaterialStatusEnum) => void;
}

const MaterialsContent: FC<MaterialsContentType> = ({
  id,
  link,
  description,
  tags,
  status,
  updateLinkHandler,
  updateDescriptionHandler,
  updateStatusHandler,
  updateTagsHandler,
}) => {
  return (
    <BlockColumn blockStyles="p-[70px] items-start">
      <MaterialLink id={id} link={link} updateLinkHandler={updateLinkHandler} />
      <MaterialDescription
        id={id}
        description={description}
        updateDescriptionHandler={updateDescriptionHandler}
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

export default MaterialsContent;
