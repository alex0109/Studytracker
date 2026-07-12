import { useState } from "react";
import { getMaterial } from "@/entities/material";
import { useActiveSectionContext } from "@/shared/context/active-section.provider";
import { BlockColumn, Text } from "@/shared/ui";
import { MaterialContent } from "@/widgets/MaterialContent/ui";
import { MaterialHeader } from "@/widgets/MaterialHeader/ui";
import { MaterialInterface } from "@/widgets/MaterialInterface/ui";
import { QuestionsContent } from "@/widgets/QuestionsContent/ui";
import { MaterialDeleteModal } from "@/features/material/delete-material/ui";
import { getUser } from "@/entities/auth";

const MaterialPage = async ({
  params,
}: {
  params: Promise<{ materialId: string }>;
}) => {
  const { token } = await getUser();
  const { materialId } = await params;

  const material = await getMaterial(token, materialId);

  const { activeSection } = useActiveSectionContext();

  const [open, setOpen] = useState(false);

  if (!material) {
    return (
      <BlockColumn>
        <Text text="Loading..." />
      </BlockColumn>
    );
  }

  return (
    <>
      <MaterialHeader
        id={material.id}
        title={material.title}
        type={material.type}
        createdAt={material.createdAt}
        setOpen={setOpen}
      />
      <MaterialInterface />
      {activeSection == "Questions" ? (
        <QuestionsContent id={material.id} />
      ) : (
        <MaterialContent
          id={material.id}
          link={material.link}
          content={material.content}
          tags={material.materialTags?.map((item) => item.name)}
          status={material.status}
        />
      )}

      <MaterialDeleteModal id={material.id} open={open} setOpen={setOpen} />
    </>
  );
};

export default MaterialPage;
