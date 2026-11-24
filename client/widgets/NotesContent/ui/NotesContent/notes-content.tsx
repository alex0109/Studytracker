import { FC, ReactNode, useRef, useState } from "react";
import { LuTrash2 } from "react-icons/lu";
import { NoteTypeEnum, useNoteExact, noteInterface, NoteInterfaceEnum } from "@/entities/note";
import { Button, Skeleton } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { NoteDrawing, NoteText, NoteTitle } from "@/features/note/update-note";
import { NoteDeleteModal } from "@/features/note/delete-note";
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
  // Where to go once the note is deleted: it can't stay open
  onDeleted?: () => void;
  // The questions of the note, put in by the page
  questions: ReactNode;
}

export const NotesContent: FC<NotesContentProps> = ({
  materialId,
  noteId,
  title,
  type,
  onOpenDictionary,
  onDeleted,
  questions,
}) => {
  const { t } = useTranslation();
  const { activeSection } = useActiveSectionContext();
  // The list has no content: text and drawing are loaded for the opened note only
  const { exactNoteData, exactNoteError } = useNoteExact(materialId, noteId);
  const textContent = exactNoteData?.textContent ?? undefined;
  const drawingContent = exactNoteData?.drawingContent ?? undefined;
  const textRef = useRef<HTMLDivElement>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  return (
    <div
      key={noteId}
      className="flex flex-3 flex-col justify-center items-center p-3 sm:p-5 w-full min-w-0"
    >
      {/* Same layout as a material and a dictionary: the kind and the quiet delete on top, then the title */}
      <header className="w-full mt-2 mb-2 flex flex-col gap-3 sm:mt-5">
        <div className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2">
          {type !== NoteTypeEnum.pdfAnnotation && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{t(`notes.types.${type}`)}</p>
          )}
          <Button
            variant="ghost"
            aria-label={t("common.delete")}
            title={t("common.delete")}
            className="ml-auto text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
            onClick={() => setDeleteOpen(true)}
          >
            <LuTrash2 aria-hidden />
            <span className="hidden sm:inline">{t("common.delete")}</span>
          </Button>
        </div>
        <NoteTitle materialId={materialId} noteId={noteId} title={title} />
      </header>
      <NoteDeleteModal
        materialId={materialId}
        noteId={noteId}
        title={title}
        type={type}
        open={deleteOpen}
        setOpen={setDeleteOpen}
        onDeleted={onDeleted}
      />
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
