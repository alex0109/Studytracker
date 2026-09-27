import React, { FC } from "react";
import type { IDrawingContent, NoteTypeEnum } from "@/entities/note/model";
import { NoteDrawing, NoteText } from "@/features/note/update-note";
import { NoteTitle } from "@/features/note/update-note/ui/NoteTitle/title";
import { RichTextDocument } from "@/shared/types";

interface NotesContentProps {
  materialId: string;
  noteId: string;
  textContent?: RichTextDocument;
  drawingContent?: IDrawingContent;
  title: string;
  type: NoteTypeEnum;
}

export const NotesContent: FC<NotesContentProps> = ({
  materialId,
  noteId,
  textContent,
  drawingContent,
  title,
  type,
}) => {
  return (
    <div
      key={noteId}
      className="flex flex-3 flex-col justify-center items-center p-5 w-full min-w-0"
    >
      <NoteTitle materialId={materialId} noteId={noteId} title={title} />
      <div className="min-h-125 max-w-full min-w-0 w-full">
        {type === "text" ? (
          <NoteText
            materialId={materialId}
            propNoteId={noteId}
            textContent={textContent}
          />
        ) : type === "drawing" ? (
          <NoteDrawing
            materialId={materialId}
            propNoteId={noteId}
            drawingContent={drawingContent}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
