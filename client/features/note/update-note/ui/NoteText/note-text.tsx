import React, { FC } from "react";
import { RichTextDocument } from "@/shared/types";
import dynamic from "next/dynamic";
import { useNoteUpdate } from "../../hooks/useNoteUpdate";

const TextEditor = dynamic(
  () => import("@/shared/ui/ContentEditor/content-editor"),
  {
    ssr: false,
  },
);

interface NoteTextProps {
  materialId: string;
  propNoteId: string;
  textContent?: RichTextDocument;
}

export const NoteText: FC<NoteTextProps> = ({
  materialId,
  propNoteId,
  textContent,
}) => {
  const { updateNote } = useNoteUpdate(propNoteId);

  const updateContentHandler = (
    materialId: string,
    content: RichTextDocument,
    noteId?: string,
  ): void => {
    updateNote({
      noteId: propNoteId,
      materialId,
      dataToUpdate: { textContent: content },
    });
  };
  return (
    <TextEditor
      materailId={materialId}
      noteId={propNoteId}
      initialContent={textContent ?? undefined}
      updateContentHandler={updateContentHandler}
    />
  );
};
