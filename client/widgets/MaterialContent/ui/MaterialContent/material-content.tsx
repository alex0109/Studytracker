"use client";

import { useTranslation } from "@/shared/i18n";
import { FC, useRef, useState } from "react";
import {
  MaterialStatusEnum,
  MaterialDate,
  MaterialTypeEnum,
  materialInterface,
  MaterialInterfaceEnum,
  useMaterialExact,
} from "@/entities/material";
import {
  MaterialTextContent,
  MaterialStatus,
  MaterialTitle,
  MaterialType,
} from "@/features/material/update-material/ui";
import { ITagResponse } from "@/entities/tag";
import { MaterialTags } from "@/widgets/MaterialTags";
import { Button, Skeleton } from "@/shared/radix-ui";
import { MaterialDeleteModal } from "@/features/material/delete-material/ui";
import { MaterialShareModal } from "@/features/material/share-material";
import { useActiveSectionContext } from "@/shared/context/active-section.provider";
import { QuestionsContent } from "@/widgets/QuestionsContent";
import { AttemptsContent } from "@/widgets/AttemptsContent";
import { SwitchInterface } from "@/shared/ui/SwitchInterface";
import { LuDownload, LuLibrary, LuTrash2 } from "react-icons/lu";
import { SubmitToLibraryModal } from "@/features/library/send-library-request";
import { AddFromSelection } from "@/features/dictionary/add-from-selection";
import { IDictionaryResponse } from "@/entities/dictionary";

interface MaterialContentType {
  id: string;
  noteId?: string;
  assessmentId: string;
  link: string | undefined;
  tags?: ITagResponse[];
  status: MaterialStatusEnum;
  title: string;
  type: MaterialTypeEnum;
  createdAt: Date;
  isImported?: boolean;
  isFromLibrary?: boolean;
  importedAt?: Date;
  // Opens a dictionary of this material, e.g. after a word was added from the text
  onOpenDictionary?: (dictionary: IDictionaryResponse) => void;
}

export const MaterialContent: FC<MaterialContentType> = ({
  id,
  noteId,
  assessmentId,
  tags,
  status,
  title,
  type,
  createdAt,
  isImported,
  isFromLibrary,
  importedAt,
  onOpenDictionary,
}) => {
  const { t, i18n } = useTranslation();
  const { activeSection } = useActiveSectionContext();
  const [open, setOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  // The list has no content: the text is loaded for the opened material only
  const { exactMaterialData, exactMaterialError } = useMaterialExact(id);

  return (
    <div className="flex flex-col w-full p-3 sm:p-5 min-w-0">
      {/* Facts on the left, actions on the right, and the title below with room to breathe.
          On phones the actions drop to their own row instead of pressing on the title */}
      <header className="flex w-full flex-col gap-5 sm:gap-7 mb-2">
        <div className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
            <MaterialType id={id} type={type} />
            <MaterialDate createdAt={createdAt} />
            {isImported && (
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-1 text-xs font-medium text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                {isFromLibrary ? <LuLibrary aria-hidden /> : <LuDownload aria-hidden />}
                {isFromLibrary ? t("library.fromLibrary") : t("materials.imported")}
                {importedAt &&
                  ` · ${new Date(importedAt).toLocaleDateString(i18n.language, { day: "numeric", month: "short", year: "numeric" })}`}
              </span>
            )}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <MaterialShareModal materialId={id} />
            {/* A library copy goes back only through its own library material */}
            {!isFromLibrary && (
              <Button variant="outline" onClick={() => setLibraryOpen(true)}>
                <LuLibrary aria-hidden /> {t("library.sendMaterial")}
              </Button>
            )}
            <span aria-hidden className="mx-0.5 h-6 w-px bg-neutral-200 dark:bg-neutral-700" />
            {/* Rarely needed and not undoable, so it is quiet and kept apart from the rest */}
            <Button
              variant="ghost"
              aria-label={t("common.delete")}
              title={t("common.delete")}
              className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
              onClick={() => setOpen(true)}
            >
              <LuTrash2 aria-hidden />
              <span className="hidden sm:inline">{t("common.delete")}</span>
            </Button>
          </div>
        </div>
        <MaterialTitle id={id} title={title} />
      </header>
      <SwitchInterface switchInterface={materialInterface} />
      {activeSection === MaterialInterfaceEnum.Questions ? (
        <QuestionsContent materialId={id} assessmentId={assessmentId} />
      ) : activeSection === MaterialInterfaceEnum.Attempts ? (
        <AttemptsContent materialId={id} noteId={noteId} />
      ) : (
        <div className="flex flex-col justify-center items-start gap-3 bg-transparent min-h-[500px] rounded-2xl p-0 sm:p-5">
          {/* The editor reads its text once, so it waits for the loaded one: an empty start
              would be saved over the real text */}
          {exactMaterialData ? (
            <div ref={textRef} className="w-full min-w-0">
              <MaterialTextContent id={id} content={exactMaterialData.content} />
              <AddFromSelection materialId={id} containerRef={textRef} onOpenDictionary={onOpenDictionary} />
            </div>
          ) : exactMaterialError ? (
            <p className="text-sm text-neutral-500">{t("errors.generic")}</p>
          ) : (
            <Skeleton className="h-[250px] w-full" />
          )}
          <footer className="mt-6 flex w-full flex-col gap-4 border-t border-neutral-200 pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between dark:border-neutral-800">
            <MaterialTags materialId={id} materialTags={tags} />
            <MaterialStatus id={id} materialStatus={status} />
          </footer>
        </div>
      )}
      <MaterialDeleteModal id={id} open={open} setOpen={setOpen} />
      <SubmitToLibraryModal open={libraryOpen} setOpen={setLibraryOpen} materialId={id} />
    </div>
  );
};
