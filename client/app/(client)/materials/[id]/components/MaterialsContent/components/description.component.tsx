import { FC } from "react";
import { RichTextDocument } from "@/app/types/types";
import dynamic from "next/dynamic";

const TextEditor = dynamic(
  () => import("../../../../components/text-editor/text-editor"),
  {
    ssr: false,
  },
);

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
