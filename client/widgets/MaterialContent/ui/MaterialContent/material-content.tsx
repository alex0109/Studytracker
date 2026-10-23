"use client";

import { FC, useState } from "react";
import {
  MaterialStatusEnum,
  MaterialDate,
  MaterialTypeEnum,
  materialInterface,
  MaterialInterfaceEnum,
} from "@/entities/material";
import {
  MaterialTextContent,
  MaterialStatus,
  MaterialTitle,
  MaterialType,
} from "@/features/material/update-material/ui";
import { ITagResponse } from "@/entities/tag";
import { MaterialTags } from "@/widgets/MaterialTags";
import { Button } from "@/shared/radix-ui";
import { MaterialDeleteModal } from "@/features/material/delete-material/ui";
import { MaterialShareModal } from "@/features/material/share-material";
import { useActiveSectionContext } from "@/shared/context/active-section.provider";
import { QuestionsContent } from "@/widgets/QuestionsContent";
import { AttemptsContent } from "@/widgets/AttemptsContent";
import { RichTextDocument } from "@/shared/types";
import { SwitchInterface } from "@/shared/ui/SwitchInterface";
import { LuDownload } from "react-icons/lu";

interface MaterialContentType {
  id: string;
  noteId?: string;
  assessmentId: string;
  link: string | undefined;
  content?: RichTextDocument;
  tags?: ITagResponse[];
  status: MaterialStatusEnum;
  title: string;
  type: MaterialTypeEnum;
  createdAt: Date;
  isImported?: boolean;
  importedAt?: Date;
}

export const MaterialContent: FC<MaterialContentType> = ({
  id,
  noteId,
  assessmentId,
  link,
  content,
  tags,
  status,
  title,
  type,
  createdAt,
  isImported,
  importedAt,
}) => {
  const { activeSection } = useActiveSectionContext();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col w-full p-5 min-w-0">
      <div className="flex flex-col w-full justify-center items-center mb-5">
        <div className="flex w-full justify-end gap-2">
          <MaterialShareModal materialId={id} />
          <div>
            <Button
              size="lg"
              variant="destructive"
              onClick={() => setOpen(true)}
            >
              Delete
            </Button>
          </div>
        </div>
        <MaterialTitle id={id} title={title} />
        <MaterialType id={id} type={type} />
        <MaterialDate createdAt={createdAt} />
        {isImported && (
          <span className="mt-2 inline-flex items-center gap-1 rounded-xl bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">
            <LuDownload /> Imported
            {importedAt &&
              ` · ${new Date(importedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`}
          </span>
        )}
      </div>
      <SwitchInterface switchInterface={materialInterface} />
      {activeSection === MaterialInterfaceEnum.Questions ? (
        <QuestionsContent materialId={id} assessmentId={assessmentId} />
      ) : activeSection === MaterialInterfaceEnum.Attempts ? (
        <AttemptsContent materialId={id} noteId={noteId} />
      ) : (
        <div className="flex flex-col justify-center items-start gap-3 bg-transparent min-h-[500px] rounded-2xl p-5">
          <MaterialTextContent id={id} content={content} />
          <MaterialTags materialId={id} materialTags={tags} />
          <MaterialStatus id={id} materialStatus={status} />
        </div>
      )}
      <MaterialDeleteModal id={id} open={open} setOpen={setOpen} />
    </div>
  );
};
