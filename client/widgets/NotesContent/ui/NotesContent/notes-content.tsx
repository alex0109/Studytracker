import { FC, ReactNode, useRef } from "react";
import { NoteTypeEnum, useNoteExact, noteInterface, NoteInterfaceEnum } from "@/entities/note";
import { Skeleton } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { NoteDrawing, NoteText, NoteTitle } from "@/features/note/update-note";
import { SwitchInterface } from "@/shared/ui/SwitchInterface";
import { useActiveSectionContext } from "@/shared/context";
import { SummaryNote } from "../SummaryNote/summary-note";
import { EssayNote } from "../EssayNote/essay-note";
import { AddFromSelection } from "@/features/dictionary/add-from-selection";
import { IDictionaryResponse } from "@/entities/dictionary";

interface NotesContentProps {
  materialId: string;
  noteId: string;
  title: string;
  type: NoteTypeEnum;
  onOpenDictionary?: (dictionary: IDictionaryResponse) => void;
  // The questions of the note, put in by the page
  questions: ReactNode;
}

export const NotesContent: FC<NotesContentProps> = ({
  materialId,
  noteId,
  title,
  type,
  onOpenDictionary,
  questions,
}) => {
  const { t } = useTranslation();
  const { activeSection } = useActiveSectionContext();
  // The list has no content: text and drawing are loaded for the opened note only
  const { exactNoteData, exactNoteError } = useNoteExact(materialId, noteId);
  const textContent = exactNoteData?.textContent ?? undefined;
  const drawingContent = exactNoteData?.drawingContent ?? undefined;
  const textRef = useRef<HTMLDivElement>(null);
  return (
    <div
      key={noteId}
      className="flex flex-3 flex-col justify-center items-center p-3 sm:p-5 w-full min-w-0"
    >
      <header className="w-full mt-2 mb-2 sm:mt-7">
        <NoteTitle materialId={materialId} noteId={noteId} title={title} />
      </header>
      {type === NoteTypeEnum.summary ? null : (
        <SwitchInterface switchInterface={noteInterface} />
      )}
      {activeSection === NoteInterfaceEnum.Questions ? (
        questions
      ) : (
        <div className="min-h-125 max-w-full min-w-0 w-full">
          {/* Editors read their content once, so they wait for the loaded one:
              an empty start would be saved over the real note */}
          {!exactNoteData ? (
            exactNoteError ? (
              <p className="text-sm text-neutral-500">{t("errors.generic")}</p>
            ) : (
              <Skeleton className="h-[250px] w-full" />
            )
          ) : type === NoteTypeEnum.text ||
            type === NoteTypeEnum.summary ||
            type === NoteTypeEnum.essay ? (
            // Words can go to a dictionary of the material from a note's text too
            <div ref={textRef} className="w-full min-w-0">
              {type === NoteTypeEnum.text ? (
                <NoteText
                  materialId={materialId}
                  propNoteId={noteId}
                  textContent={textContent}
                />
              ) : type === NoteTypeEnum.essay ? (
                <EssayNote
                  materialId={materialId}
                  noteId={noteId}
                  textContent={textContent}
                />
              ) : (
                <SummaryNote
                  materialId={materialId}
                  noteId={noteId}
                  textContent={textContent}
                />
              )}
              <AddFromSelection materialId={materialId} containerRef={textRef} onOpenDictionary={onOpenDictionary} />
            </div>
          ) : type === NoteTypeEnum.drawing ? (
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
