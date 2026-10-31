import { FC } from "react";
import dynamic from "next/dynamic";
import { useMaterialUpdate } from "../../hooks/useMaterialUpdate";
import { RichTextDocument } from "@/shared/types";

const TextEditor = dynamic(
  () => import("@/shared/ui/ContentEditor/content-editor"),
  {
    ssr: false,
  },
);

interface MaterialTextContentProps {
  id: string;
  content?: RichTextDocument;
}

export const MaterialTextContent: FC<MaterialTextContentProps> = ({
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
      materailId={id}
      initialContent={content ?? undefined}
      updateContentHandler={updateContentHandler}
    />
  );
};
