import React, { FC } from "react";
import { IDrawingContent } from "@/entities/note/model";
import { DrawingBoard } from "./drawing-board";
import { useNoteUpdate } from "../../hooks/useNoteUpdate";

interface NoteDrawingProps {
  materialId: string;
  propNoteId: string;
  drawingContent?: IDrawingContent;
}

export const NoteDrawing: FC<NoteDrawingProps> = ({
  materialId,
  propNoteId,
  drawingContent,
}) => {
  const { updateNote } = useNoteUpdate(propNoteId);

  const updateContentHandler = (
    materialId: string,
    content: IDrawingContent,
    noteId?: string,
  ): void => {
    updateNote({
      noteId: propNoteId,
      materialId,
      dataToUpdate: { drawingContent: content },
    });
  };

  return (
    <DrawingBoard
      materialId={materialId}
      noteId={propNoteId}
      initialContent={drawingContent}
      updateContentHandler={updateContentHandler}
    />
  );
};
