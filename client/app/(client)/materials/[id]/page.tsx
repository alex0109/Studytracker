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
import TextEditor from "@/app/(client)/materials/components/text-editor/text-editor";
import useDebounce from "@/shared/hooks/use-debounce.hook";
import { Button } from "@/shared/components/ui/button";
import { LuX } from "react-icons/lu";
import moment from "moment";

const MaterialPage: FC = () => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const {
    exactMaterial,
    exactMaterialLoading,
    deleteMaterial,
    updateMaterial,
  } = useMaterials(params.id as string);

  const [tags, setTags] = useState<string[] | undefined>(undefined);
  const [value, setValue] = useState("");

  const [selectStatus, setSelectStatus] = useState<
    "tolearn" | "inprocess" | "finished" | undefined
  >(undefined);

  const [selectType, setSelectType] = useState<
    "article" | "video" | "summary" | "practice" | "test" | undefined
  >(undefined);

  const debouncedType = useDebounce(selectType, 2000);
  const debouncedStatus = useDebounce(selectStatus, 2000);

  const handleDeleteMaterial = (id: string) => {
    deleteMaterial(id);
    router.back();
  };

  const handleDeleteTag = (id: string, tag: string) => {
    setTags((tags) => tags?.filter((item) => item !== tag));
    updateMaterial({
      id: id,
      dataToUpdate: {
        tags: exactMaterial?.tags?.filter((item) => item !== tag),
      },
    });
  };

  const ENTER = "Enter";
  const COMMA = ",";

  const addTagEnter = () => {
    const tag = value.trim();
    if (!tag) return;
    const newTags = [...(tags ?? []), tag];
    updateMaterial({ id: exactMaterial!.id, dataToUpdate: { tags: newTags } });
    setTags(newTags);
    setValue("");
  };

  const addTagComma = () => {
    const tag = value.trim().slice(0, -1);
    if (!tag) return;
    const newTags = [...(tags ?? []), tag];
    updateMaterial({ id: exactMaterial!.id, dataToUpdate: { tags: newTags } });
    setTags(newTags);
    setValue("");
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;
    if (key === COMMA) {
      addTagComma();
    }
    if (key === ENTER) {
      addTagEnter();
    }
  };

  useEffect(() => {
    if (debouncedType && exactMaterial) {
      updateMaterial({
        id: exactMaterial!.id!,
        dataToUpdate: { type: debouncedType },
      });
    }
    if (debouncedStatus && exactMaterial) {
      updateMaterial({
        id: exactMaterial!.id!,
        dataToUpdate: { status: debouncedStatus },
      });
    }
  }, [debouncedType, debouncedStatus]);

  useEffect(() => {
    if (exactMaterial) {
      setTags(exactMaterial.tags);
      setSelectStatus(exactMaterial.status);
      setSelectType(exactMaterial.type);
    }
  }, [exactMaterial]);

  if (!exactMaterial || !exactMaterial.tags || exactMaterialLoading) {
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
          maxLength={20}
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
        <div>
          <Text
            textStyles="text-neutral-400"
            text={moment(exactMaterial.created_at).format("DD MMMM yy")}
          />
        </div>
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
          <div className="flex flex-col flex-wrap gap-2">
            <div>
              <input
                type="text"
                value={value}
                placeholder="Tag..."
                onChange={(e) => setValue(e.target.value)}
                onKeyUp={handleKeyUp}
                className="text-[15px] px-4 py-2 my-2 rounded-2xl bg-neutral-200 dark:bg-neutral-700"
              />
            </div>
            <div className="flex flex-row gap-2">
              {!tags || tags.length == 0 ? (
                <p>No tags</p>
              ) : (
                tags?.map((tag, i) => (
                  <Button
                    key={i}
                    className="bg-blue-200 text-blue-800 px-2 py-1 rounded hover:bg-blue-100"
                    onClick={() => handleDeleteTag(exactMaterial.id, tag)}
                  >
                    <LuX />
                    {tag}
                  </Button>
                ))
              )}
            </div>
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
