import { FC } from "react";
import dynamic from "next/dynamic";
import { RichTextDocument } from "@/entities/material";

const TextEditor = dynamic(
  () =>
    import("../../../../../app/(client)/materials/components/text-editor/text-editor"),
  {
    ssr: false,
  },
);

interface MaterialTextContentType {
  id: string;
  content: RichTextDocument | undefined;
  updateDescriptionHandler: (id: string, content: RichTextDocument) => void;
}

export const MaterialTextContent: FC<MaterialTextContentType> = ({
  id,
  content,
  updateDescriptionHandler,
}) => {
  return (
    <TextEditor
      id={id}
      initialContent={content ?? undefined}
      updateDescriptionHandler={updateDescriptionHandler}
    />
  );
};
