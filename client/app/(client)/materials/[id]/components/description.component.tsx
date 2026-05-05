import React, { FC } from "react";
import TextEditor from "../../components/text-editor/text-editor";
import { RichTextDocument } from "@/app/types/types";

interface MaterialDescriptionType {
  id: string;
  description: RichTextDocument | undefined;
}

const MaterialDescription: FC<MaterialDescriptionType> = ({
  id,
  description,
}) => {
  return <TextEditor initialContent={description ?? undefined} id={id} />;
};

export default MaterialDescription;
