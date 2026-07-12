import { FC } from "react";
import dynamic from "next/dynamic";
import { RichTextDocument } from "@/entities/material";
import useMaterialUpdate from "../../hooks/useMaterialUpdate";

const TextEditor = dynamic(
  () => import("../MaterialContentEditor/content-editor"),
  {
    ssr: false,
  },
);

interface MaterialTextContentType {
  id: string;
  content: RichTextDocument | undefined;
}

export const MaterialTextContent: FC<MaterialTextContentType> = ({
  id,
  content,
}) => {
  const { updateMaterial } = useMaterialUpdate(id);

  const updateContentHandler = (
    materialId: string,
    content: RichTextDocument,
  ): void => {
    updateMaterial({ id: materialId, dataToUpdate: { content } });
  };

  return (
    <TextEditor
      id={id}
      initialContent={content ?? undefined}
      updateContentHandler={updateContentHandler}
    />
  );
};
