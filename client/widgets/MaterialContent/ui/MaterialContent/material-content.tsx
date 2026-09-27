"use client";

import { FC, useState } from "react";
import {
  MaterialStatusEnum,
  MaterialDate,
  MaterialTypeEnum,
} from "@/entities/material";
import {
  MaterialLink,
  MaterialTextContent,
  MaterialStatus,
  MaterialTitle,
  MaterialType,
} from "@/features/material/update-material/ui";
import { ITagResponse } from "@/entities/tag";
import { MaterialTags } from "@/widgets/MaterialTags";
import { Button } from "@/shared/radix-ui";
import { MaterialDeleteModal } from "@/features/material/delete-material/ui";
import { MaterialInterface } from "@/widgets/MaterialInterface";
import { useActiveSectionContext } from "@/shared/context/active-section.provider";
import { MaterialInterfaceEnum } from "@/widgets/MaterialInterface/lib";
import { QuestionsContent } from "@/widgets/QuestionsContent";
import { AttemptsContent } from "@/widgets/AttemptsContent";
import { useFinishedAttempts } from "@/entities/attempt";
import { RichTextDocument } from "@/shared/types";

interface MaterialContentType {
  id: string;
  assessmentId: string;
  link: string | undefined;
  content?: RichTextDocument;
  tags?: ITagResponse[];
  status: MaterialStatusEnum;
  title: string;
  type: MaterialTypeEnum;
  createdAt: Date;
}

export const MaterialContent: FC<MaterialContentType> = ({
  id,
  assessmentId,
  link,
  content,
  tags,
  status,
  title,
  type,
  createdAt,
}) => {
  const { activeSection } = useActiveSectionContext();
  const { finishedAttempts } = useFinishedAttempts(id);
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col w-full p-5 min-w-0">
      <div className="flex flex-col w-full justify-center items-center mb-5">
        <div className="flex w-full justify-end">
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
      </div>
      <MaterialInterface />
      {activeSection === MaterialInterfaceEnum.Questions ? (
        <QuestionsContent materialId={id} assessmentId={assessmentId} />
      ) : activeSection === MaterialInterfaceEnum.Attempts ? (
        <AttemptsContent materialId={id} attempts={finishedAttempts} />
      ) : (
        <div className="flex flex-3 flex-col justify-center items-start gap-3 bg-transparent min-h-[500px] rounded-2xl p-5">
          <MaterialTextContent id={id} content={content} />
          <MaterialTags materialId={id} materialTags={tags} />
          <MaterialStatus id={id} materialStatus={status} />
        </div>
      )}
      <MaterialDeleteModal id={id} open={open} setOpen={setOpen} />
    </div>
  );
};
