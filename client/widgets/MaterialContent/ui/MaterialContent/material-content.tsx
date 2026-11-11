"use client";

import { useTranslation } from "@/shared/i18n";
import { FC, useRef, useState } from "react";
import {
  MaterialStatusEnum,
  MaterialTypeEnum,
  materialInterface,
  MaterialInterfaceEnum,
  useMaterialExact,
} from "@/entities/material";
import { MaterialTextContent, MaterialTitle } from "@/features/material/update-material";
import { ITagResponse } from "@/entities/tag";
import { Skeleton } from "@/shared/radix-ui";
import { useActiveSectionContext } from "@/shared/context/active-section.provider";
import { QuestionsContent } from "@/widgets/QuestionsContent";
import { DeadlinePlanCard } from "@/widgets/Deadlines";
import { AttemptsContent } from "@/widgets/AttemptsContent";
import { SwitchInterface } from "@/shared/ui/SwitchInterface";
import { LuDownload, LuLibrary } from "react-icons/lu";
import { AddFromSelection } from "@/features/dictionary/add-from-selection";
import { IDictionaryResponse } from "@/entities/dictionary";
import { MaterialActions } from "../MaterialActions/material-actions";
import { MaterialProperties } from "../MaterialProperties/material-properties";
import { MaterialPodcast } from "../MaterialPodcast/material-podcast";

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
  const textRef = useRef<HTMLDivElement>(null);
  const [podcastOpen, setPodcastOpen] = useState(false);
  // The list has no content: the text is loaded for the opened material only
  const { exactMaterialData, exactMaterialError } = useMaterialExact(id);

  const dateOf = (value: Date) =>
    new Date(value).toLocaleDateString(i18n.language, { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="flex flex-col w-full p-3 sm:p-5 min-w-0">
      {/* The title first, the two actions beside it, then the properties as a calm list:
          everything that used to sit in one crowded row now has its own place */}
      <header className="mb-4 flex w-full flex-col gap-4">
        <div className="flex w-full items-start gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
              <span>{t("materials.createdOn", { date: dateOf(createdAt) })}</span>
              {isImported && (
                <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-0.5 font-medium text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                  {isFromLibrary ? <LuLibrary aria-hidden /> : <LuDownload aria-hidden />}
                  {isFromLibrary ? t("library.fromLibrary") : t("materials.imported")}
                  {importedAt && ` · ${dateOf(importedAt)}`}
                </span>
              )}
            </p>
            <MaterialTitle id={id} title={title} className="-ml-2 px-2 pr-8 text-left text-2xl sm:text-3xl" />
          </div>
          <MaterialActions
            materialId={id}
            isFromLibrary={isFromLibrary}
            isPodcastOpen={podcastOpen}
            onTogglePodcast={() => setPodcastOpen((value) => !value)}
          />
        </div>

        <MaterialProperties id={id} type={type} status={status} tags={tags} />
        <DeadlinePlanCard materialId={id} compact />
        {/* Stays open while switching tabs, so listening goes on next to the questions */}
        {podcastOpen && <MaterialPodcast materialId={id} title={title} />}
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
        </div>
      )}
    </div>
  );
};
