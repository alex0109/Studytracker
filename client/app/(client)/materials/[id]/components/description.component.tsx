import React, { FC } from "react";
import TextEditor from "../../components/text-editor/text-editor";
import { RichTextDocument } from "@/app/types/types";

interface MaterialDescriptionType {
  id: string;
  description: RichTextDocument | undefined;
  updateDescriptionHandler: (id: string, description: RichTextDocument) => void;
}

const MaterialDescription: FC<MaterialDescriptionType> = ({
  id,
  description,
  updateDescriptionHandler,
}) => {
  return (
    <TextEditor
      id={id}
      initialContent={description ?? undefined}
      updateDescriptionHandler={updateDescriptionHandler}
    />
  );
};

export default MaterialDescription;
