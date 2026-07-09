"use client";

import { FC, useState } from "react";
import {
  BlockColumn,
  Text,
  Title,
  CustomButton,
  Modal,
  ContainerRow,
} from "@/shared/ui";
import { useRouter } from "next/navigation";
import MaterialTitle from "./materials-content/components/title.component";
import MaterialDate from "./materials-content/components/date.component";
import useMaterialUpdate from "../../../../../features/material/update-material/hooks/useMaterialUpdate";
import useMaterialDelete from "../../../../../features/material/delete-material/hooks/useMaterialDelete";
import MaterialType from "./materials-content/components/type.component";
import { Button } from "@/shared/radix-ui/Button/button";
import MaterialsContent from "./materials-content/materials.component";
import { materialInterface } from "../lib/data/data";
import { useActiveSectionContext } from "@/shared/context/active-section.provider";
import { motion } from "framer-motion";
import { IMaterial } from "@/entities/material/model/material.type";
import { MaterialTypeEnum } from "@/entities/material/model/material.type.type";
import { MaterialStatusEnum } from "@/entities/material/model/material.status.type";
import { RichTextDocument } from "@/entities/material/model/rich.text.document.type";
import useQuestionCreate from "../../../../../features/question/create-question/hooks/useOpenQuestionCreate";
import useQuestionDelete from "../../../../../features/question/delete-question/hooks/useQuestionDelete";
import Questions from "./questions/questions.component";
import useAssessmentStart from "../../../../../features/attempt/start-attempt/hooks/useAttemptStart";
import { useQuestionAll } from "@/entities/question";

interface MaterialPagetype {
  materialId: string;
  exactMaterial: IMaterial;
}

const MaterialPage: FC<MaterialPagetype> = ({ materialId, exactMaterial }) => {
  const router = useRouter();

  const { activeSection, setActiveSection, setTimeOfLastClick } =
    useActiveSectionContext();

  const [open, setOpen] = useState(false);

  const { deleteMaterial } = useMaterialDelete(materialId);
  const { updateMaterial } = useMaterialUpdate(materialId);

  const { questionsData } = useQuestionAll(exactMaterial.id);
  const { createQuestion } = useQuestionCreate(exactMaterial.id);
  const { deleteQuestion } = useQuestionDelete(exactMaterial.id);

  const { startAssessment, startAssessmentPending } = useAssessmentStart(
    exactMaterial.id,
  );

  const updateTitleHandler = (materialId: string, title: string): void => {
    updateMaterial({ id: materialId, dataToUpdate: { title } });
  };

  const updateTypeHandler = (
    materialId: string,
    type: MaterialTypeEnum,
  ): void => {
    updateMaterial({ id: materialId, dataToUpdate: { type } });
  };

  const updateTagsHandler = (materialId: string, tags: string[]): void => {
    updateMaterial({ id: materialId, dataToUpdate: { tags } });
  };

  const updateStatusHandler = (
    materialId: string,
    status: MaterialStatusEnum,
  ): void => {
    updateMaterial({ id: materialId, dataToUpdate: { status } });
  };

  const updateLinkHandler = (materialId: string, link: string): void => {
    updateMaterial({ id: materialId, dataToUpdate: { link } });
  };

  const updateDescriptionHandler = (
    materialId: string,
    description: RichTextDocument,
  ): void => {
    updateMaterial({ id: materialId, dataToUpdate: { description } });
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
        <MaterialDate createdAt={exactMaterial.createdAt} />
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
      {activeSection == "Questions" ? (
        <Questions
          questions={questionsData}
          createQuestion={createQuestion}
          deleteQuestion={deleteQuestion}
          startAssessment={startAssessment}
          startAssessmentIsPending={startAssessmentPending}
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
