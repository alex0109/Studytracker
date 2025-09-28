"use client";

import BlockColumn from "@/shared/components/block-column";
import Text from "@/shared/components/text";
import Title from "@/shared/components/title";
import { useParams, useRouter } from "next/navigation";
import CustomButton from "@/shared/components/button";
import useMaterials from "../hooks/useMaterials.hook";
import StatusBadgeSelect from "@/shared/components/status-select";
import { FC, useEffect, useState } from "react";
import EditableField from "@/shared/components/editable-field";
import Modal from "@/shared/components/modal";
import Subtitle from "@/shared/components/subtitle";
import EditableLink from "@/shared/components/editable-link";
import TextEditor from "@/app/materials/components/text-editor/text-editor";
import useDebounce from "@/shared/hooks/use-debounce.hook";

const MaterialPage: FC = () => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const { exactMaterial, deleteMaterial, updateMaterial } = useMaterials(
    Number(params.id)
  );

  const [selectStatus, setSelectStatus] = useState<
    "tolearn" | "inprocess" | "finished" | undefined
  >(exactMaterial?.status);

  const [selectType, setSelectType] = useState<
    "article" | "video" | "summary" | "practice" | "test" | undefined
  >(exactMaterial?.type);

  const debouncedType = useDebounce(selectType, 2000);
  const debouncedStatus = useDebounce(selectStatus, 2000);

  const handleDeleteMaterial = async (id: number) => {
    deleteMaterial(id);
    router.back();
  };

  useEffect(() => {
    setSelectStatus(exactMaterial?.status);
    if (debouncedType) {
      updateMaterial({
        id: exactMaterial!.id!,
        dataToUpdate: { type: debouncedType },
      });
    }
    if (debouncedStatus) {
      updateMaterial({
        id: exactMaterial!.id!,
        dataToUpdate: { status: debouncedStatus },
      });
    }
    setTimeout(() => {
      setSelectType(exactMaterial?.type);
    }, 50);
  }, [exactMaterial, debouncedType, debouncedStatus, updateMaterial]);

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
        <EditableField
          id={exactMaterial.id}
          field="title"
          initialValue={exactMaterial.title}
          titleHeading
        />

        <select
          className="outline-none cursor-pointer text-black dark:text-white"
          value={selectType}
          onChange={(e) =>
            setSelectType(
              e.target.value as
                | "article"
                | "video"
                | "summary"
                | "practice"
                | "test"
            )
          }
        >
          <option value="article">Article</option>
          <option value="video">Video</option>
          <option value="summary">Summary</option>
          <option value="practice">Practice</option>
          <option value="test">Test</option>
        </select>
        {/* <EditableField
          id={exactMaterial.id}
          field="type"
          initialValue={exactMaterial.type}
          subtitleHeading
        /> */}
      </BlockColumn>
      <BlockColumn blockStyles="p-[70px] items-start">
        <div className="flex items-center w-full gap-2 border-b-1 border-b-neutral-700">
          <Subtitle text="Link:" />
          <EditableLink
            id={exactMaterial.id}
            initialValue={exactMaterial.link ?? ""}
          />
        </div>
        <TextEditor
          initialContent={exactMaterial.description ?? undefined}
          id={exactMaterial.id}
        />
        <div>
          <span className="italic">Tags</span>
          <div className="flex flex-wrap gap-2">
            {exactMaterial.tags?.map((tag, i) => (
              <span
                key={i}
                className="bg-blue-200 text-blue-800 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div>
          <span className="italic">Status</span>
          <StatusBadgeSelect status={selectStatus}>
            <select
              className="text-white outline-none cursor-pointer"
              onChange={(e) =>
                setSelectStatus(
                  e.target.value as "tolearn" | "inprocess" | "finished"
                )
              }
            >
              <option value="tolearn">Want to learn</option>
              <option value="inprocess">In process</option>
              <option value="finished">Finished</option>
            </select>
          </StatusBadgeSelect>
        </div>
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
