"use client";

import BlockColumn from "@/shared/components/block-column";
import Text from "@/shared/components/text";
import Title from "@/shared/components/title";
import { useParams, useRouter } from "next/navigation";
import CustomButton from "@/shared/components/button";
import { FC, useEffect, useState } from "react";
import Modal from "@/shared/components/modal";
import MaterialTitle from "./title.component";
import MaterialDate from "./date.component";
import MaterialLink from "./link.component";
import MaterialDescription from "./description.component";
import MaterialTags from "./tags.component";
import MaterialStatus from "./status.component";
import useMaterialUpdate from "../../hooks/useMaterialUpdate.hook";
import useMaterialExact from "../../hooks/useMaterialExact.hook";
import useMaterialDelete from "../../hooks/useMaterialDelete.hook";
import MaterialType from "./type.component";
import {
  IMaterial,
  MaterialStatusEnum,
  MaterialTypeEnum,
  RichTextDocument,
} from "@/app/types/types";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface MaterialPagetype {
  exactMaterial: IMaterial;
}

const MaterialPage: FC<MaterialPagetype> = ({ exactMaterial }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const { deleteMaterial } = useMaterialDelete(params.id as string);
  const { updateMaterial } = useMaterialUpdate(params.id as string);

  const updateTitleHandler = (id: string, title: string): void => {
    updateMaterial({ id, dataToUpdate: { title } });
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

  const updateTypeHandler = (id: string, type: MaterialTypeEnum): void => {
    updateMaterial({ id, dataToUpdate: { type } });
  };

  const updateLinkHandler = (id: string, link: string): void => {
    console.log("NNEWEWN", link);
    updateMaterial({ id, dataToUpdate: { link } });
  };

  const updateDescriptionHandler = (
    id: string,
    description: RichTextDocument,
  ): void => {
    updateMaterial({ id, dataToUpdate: { description } });
  };

  const handleDeleteMaterial = (id: string) => {
    deleteMaterial(id);
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
      <BlockColumn blockStyles="p-[70px] items-start">
        <MaterialLink
          id={exactMaterial.id}
          link={exactMaterial.link}
          updateLinkHandler={updateLinkHandler}
        />
        <MaterialDescription
          id={exactMaterial.id}
          description={exactMaterial.description}
          updateDescriptionHandler={updateDescriptionHandler}
        />
        <MaterialTags
          id={exactMaterial.id}
          materialTags={exactMaterial.tags}
          updateTagsHandler={updateTagsHandler}
        />
        <MaterialStatus
          id={exactMaterial.id}
          materialStatus={exactMaterial.status}
          updateStatusHandler={updateStatusHandler}
        />
      </BlockColumn>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="flex flex-col w-[200px] h-[200px] justify-center items-center gap-1">
          <Title text="Are you sure?" />
          <CustomButton
            title="Delete"
            onClick={() => handleDeleteMaterial(exactMaterial.id)}
          />
        </div>
      </Modal>
    </>
  );
};

export default MaterialPage;
