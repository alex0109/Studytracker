"use client";

import { useState } from "react";
import { useActiveSectionContext } from "@/shared/context/active-section.provider";
import { MaterialContent } from "@/widgets/MaterialContent/ui";
import { MaterialHeader } from "@/widgets/MaterialHeader/ui";
import { MaterialInterface } from "@/widgets/MaterialInterface/ui";
import { QuestionsContent } from "@/widgets/QuestionsContent/ui";
import { MaterialDeleteModal } from "@/features/material/delete-material/ui";
import { useMaterialExact } from "@/entities/material";
import MaterialLoading from "./loading";
import { AttemptsContent } from "@/widgets/AttemptsContent";
import { MaterialInterfaceEnum } from "@/widgets/MaterialInterface/lib";
import { useFinishedAttempts } from "@/entities/attempt";

export const MaterialPageClient = ({ materialId }: { materialId: string }) => {
  const { activeSection } = useActiveSectionContext();
  const [open, setOpen] = useState(false);
  const { finishedAttempts } = useFinishedAttempts(materialId);
  const { exactMaterialData } = useMaterialExact(materialId);

  if (!exactMaterialData) {
    return <MaterialLoading />;
  }

  return (
    <>
      <MaterialHeader
        id={exactMaterialData.id}
        title={exactMaterialData.title}
        type={exactMaterialData.type}
        createdAt={exactMaterialData.createdAt}
        setOpen={setOpen}
      />
      <MaterialInterface />
      {activeSection === MaterialInterfaceEnum.Questions ? (
        <QuestionsContent
          materialId={exactMaterialData.id}
          assessmentId={exactMaterialData.assessmentId}
        />
      ) : activeSection === MaterialInterfaceEnum.Attempts ? (
        <AttemptsContent materialId={materialId} attempts={finishedAttempts} />
      ) : (
        <MaterialContent
          id={exactMaterialData.id}
          link={exactMaterialData.link}
          content={exactMaterialData.content}
          tags={exactMaterialData.materialTags}
          status={exactMaterialData.status}
        />
      )}
      <MaterialDeleteModal
        id={exactMaterialData.id}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
};
