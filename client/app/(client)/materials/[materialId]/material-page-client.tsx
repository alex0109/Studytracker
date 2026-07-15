"use client";

import { useState } from "react";
import { useActiveSectionContext } from "@/shared/context/active-section.provider";
import { BlockColumn, Text } from "@/shared/ui";
import { MaterialContent } from "@/widgets/MaterialContent/ui";
import { MaterialHeader } from "@/widgets/MaterialHeader/ui";
import { MaterialInterface } from "@/widgets/MaterialInterface/ui";
import { QuestionsContent } from "@/widgets/QuestionsContent/ui";
import { MaterialDeleteModal } from "@/features/material/delete-material/ui";
import { useMaterialExact } from "@/entities/material";

export const MaterialPageClient = ({ materialId }: { materialId: string }) => {
  const { activeSection } = useActiveSectionContext();
  const [open, setOpen] = useState(false);
  const { exactMaterialData } = useMaterialExact(materialId);

  if (!exactMaterialData) {
    return (
      <BlockColumn>
        <Text text="Loading..." />
      </BlockColumn>
    );
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
      {activeSection === "Questions" ? (
        <QuestionsContent
          materialId={exactMaterialData.id}
          assessmentId={exactMaterialData.assessmentId}
        />
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
