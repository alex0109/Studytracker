import React, { FC } from "react";
import type { IDrawingContent, NoteTypeEnum } from "@/entities/note/model";
import { NoteDrawing, NoteText } from "@/features/note/update-note";
import { NoteTitle } from "@/features/note/update-note/ui/NoteTitle/title";
import { RichTextDocument } from "@/shared/types";
import { SwitchInterface } from "@/shared/ui/SwitchInterface";
import { noteInterface, NoteInterfaceEnum } from "@/entities/note/lib";
import { useActiveSectionContext } from "@/shared/context/active-section.provider";
import { QuestionsContent } from "@/widgets/QuestionsContent";
import { AttemptsContent } from "@/widgets/AttemptsContent";

interface NotesContentProps {
  materialId: string;
  noteId: string;
  assessmentId: string;
  textContent?: RichTextDocument;
  drawingContent?: IDrawingContent;
  title: string;
  type: NoteTypeEnum;
}

export const NotesContent: FC<NotesContentProps> = ({
  materialId,
  noteId,
  assessmentId,
  textContent,
  drawingContent,
  title,
  type,
}) => {
  const { activeSection } = useActiveSectionContext();
  return (
    <div
      key={noteId}
      className="flex flex-3 flex-col justify-center items-center p-5 w-full min-w-0"
    >
      <NoteTitle materialId={materialId} noteId={noteId} title={title} />
      <SwitchInterface switchInterface={noteInterface} />
      {activeSection === NoteInterfaceEnum.Questions ? (
        <QuestionsContent
          materialId={materialId}
          noteId={noteId}
          assessmentId={assessmentId}
        />
      ) : (
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
          ) : null}
        </div>
      )}
    </div>
  );
};
