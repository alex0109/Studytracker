"use client";

import BlockColumn from "@/shared/components/block-column";
import Text from "@/shared/components/text";
import Title from "@/shared/components/title";
import { useParams, useRouter } from "next/navigation";
import CustomButton from "@/shared/components/button";
import { FC, useState } from "react";
import Modal from "@/shared/components/modal";
import MaterialTitle from "./MaterialsContent/components/title.component";
import MaterialDate from "./MaterialsContent/components/date.component";
import useMaterialUpdate from "../../hooks/material/useMaterialUpdate.hook";
import useMaterialDelete from "../../hooks/material/useMaterialDelete.hook";
import MaterialType from "./MaterialsContent/components/type.component";
import ContainerRow from "@/shared/components/container-row";
import { Button } from "@/shared/components/ui/button";
import MaterialsContent from "./MaterialsContent/materials.component";
import Assessment from "./Assessments/assessments.component";
import { materialInterface } from "../lib/data/data";
import { useActiveSectionContext } from "@/shared/context/active-section.context";
import { motion } from "framer-motion";
import { IMaterial } from "@/app/types/material/material.type";
import { MaterialTypeEnum } from "@/app/types/material/material.type.type";
import { MaterialStatusEnum } from "@/app/types/material/material.status.type";
import { RichTextDocument } from "@/app/types/material/rich.text.document.type";
import useAssessmentCreate from "../../hooks/assessment/useAssessmentCreate.hook";
import useAssessmentAll from "../../hooks/assessment/useAssessmentAll.hook";
import useAssessmentDelete from "../../hooks/assessment/useAssessmentDelete.hook";

interface MaterialPagetype {
  exactMaterial: IMaterial;
}

const MaterialPage: FC<MaterialPagetype> = ({ exactMaterial }) => {
  const params = useParams();
  const router = useRouter();

  const { activeSection, setActiveSection, setTimeOfLastClick } =
    useActiveSectionContext();

  const [open, setOpen] = useState(false);

  const { deleteMaterial } = useMaterialDelete(params.id as string);
  const { updateMaterial } = useMaterialUpdate(params.id as string);

  const { assessmentsData } = useAssessmentAll(exactMaterial.id);
  const { createAssessment } = useAssessmentCreate(exactMaterial.id);
  const { deleteAssessment } = useAssessmentDelete(exactMaterial.id);

  const updateTitleHandler = (id: string, title: string): void => {
    updateMaterial({ id, dataToUpdate: { title } });
  };

  const updateTypeHandler = (id: string, type: MaterialTypeEnum): void => {
    updateMaterial({ id, dataToUpdate: { type } });
  };

  const updateTagsHandler = (id: string, tags: string[]): void => {
    updateMaterial({ id, dataToUpdate: { tags } });
  };

  const updateStatusHandler = (
    id: string,
    status: MaterialStatusEnum,
  ): void => {
    updateMaterial({ id, dataToUpdate: { status } });
  };

  const updateLinkHandler = (id: string, link: string): void => {
    updateMaterial({ id, dataToUpdate: { link } });
  };

  const updateDescriptionHandler = (
    id: string,
    description: RichTextDocument,
  ): void => {
    updateMaterial({ id, dataToUpdate: { description } });
  };

  const handleDeleteMaterial = () => {
    deleteMaterial();
    router.back();
  };

  if (!exactMaterial) {
    return (
      <BlockColumn>
        <Text text="Loading..." />
      </BlockColumn>
    );
  }

  return (
    <>
      <BlockColumn>
        <div className="flex w-full justify-between">
          <div>
            <CustomButton onClick={() => router.back()} title="Go back" />
          </div>
          <div>
            <CustomButton
              buttonStyles="bg-rose-600 border-rose-500"
              onClick={() => setOpen(true)}
              title="Delete"
            />
          </div>
        </div>
        <MaterialTitle
          id={exactMaterial.id}
          title={exactMaterial.title}
          updateTitleHandler={updateTitleHandler}
        />
        <MaterialType
          id={exactMaterial.id}
          type={exactMaterial.type}
          updateTypeHandler={updateTypeHandler}
        />
        <MaterialDate created_at={exactMaterial.created_at} />
      </BlockColumn>
      <ContainerRow blockStyles="flex w-full items-start justify-center gap-5">
        {materialInterface.map((item) => (
          <motion.div
            key={item.key}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <Button
              className="text-lg hover:bg-transparent relative"
              variant="ghost"
              onClick={() => {
                setActiveSection(item.name);
                setTimeOfLastClick(Date.now());
              }}
            >
              {item.icon} {item.name}
              {item.name === activeSection && (
                <motion.span
                  className=" bg-gray-100 rounded-full 
                    absolute inset-0 -z-10 dark:bg-neutral-950"
                  layoutId="activeSection"
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  }}
                ></motion.span>
              )}
            </Button>
          </motion.div>
        ))}
      </ContainerRow>
      {activeSection == "Assessment" ? (
        <Assessment
          assessments={assessmentsData}
          createAssessment={createAssessment}
          deleteAssessment={deleteAssessment}
        />
      ) : (
        <MaterialsContent
          id={exactMaterial.id}
          link={exactMaterial.link}
          description={exactMaterial.description}
          tags={exactMaterial.tags}
          status={exactMaterial.status}
          updateDescriptionHandler={updateDescriptionHandler}
          updateLinkHandler={updateLinkHandler}
          updateStatusHandler={updateStatusHandler}
          updateTagsHandler={updateTagsHandler}
        />
      )}

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="flex flex-col w-[200px] h-[200px] justify-center items-center gap-1">
          <Title text="Are you sure?" />
          <CustomButton title="Delete" onClick={() => handleDeleteMaterial()} />
        </div>
      </Modal>
    </>
  );
};

export default MaterialPage;
