"use client";

import BlockColumn from "@/shared/components/block-column";
import Text from "@/shared/components/text";
import Title from "@/shared/components/title";
import { useParams, useRouter } from "next/navigation";
import CustomButton from "@/shared/components/button";
import StatusBadgeSelect from "@/shared/components/status-select";
import { FC, useState } from "react";
import EditableField from "@/shared/components/editable-field";
import Modal from "@/shared/components/modal";
import Subtitle from "@/shared/components/subtitle";
import EditableLink from "@/shared/components/editable-link";
import TextEditor from "@/app/(client)/materials/components/text-editor/text-editor";
import useDebounce from "@/shared/hooks/use-debounce.hook";
import { Button } from "@/shared/components/ui/button";
import { LuX } from "react-icons/lu";
import moment from "moment";
import useMaterialExact from "../hooks/useMaterialExact.hook";
import useMaterialDelete from "../hooks/useMaterialDelete.hook";
import useMaterialUpdate from "../hooks/useMaterialUpdate.hook";

const MaterialPage: FC = () => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const { exactMaterial } = useMaterialExact(params.id as string);
  const { deleteMaterial } = useMaterialDelete(params.id as string);
  const { updateMaterial } = useMaterialUpdate(params.id as string);

  const [titleValue, setTitleValue] = useState(exactMaterial?.title);

  const [tags, setTags] = useState<string[] | undefined>(exactMaterial?.tags);
  const [tagValue, setTagValue] = useState("");

  const [selectStatus, setSelectStatus] = useState<
    "tolearn" | "inprocess" | "finished" | undefined
  >(exactMaterial?.status);

  const [selectType, setSelectType] = useState<
    "article" | "video" | "summary" | "practice" | "test" | undefined
  >(exactMaterial?.type);

  // const debouncedType = useDebounce(selectType, 2000) as MaterialTypeEnum;
  // const debouncedStatus = useDebounce(selectStatus, 2000) as MaterialStatusEnum;

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
    const tag = tagValue.trim();
    if (!tag) return;
    const newTags = [...(tags ?? []), tag];
    updateMaterial({ id: exactMaterial!.id, dataToUpdate: { tags: newTags } });
    setTags(newTags);
    setTagValue("");
  };

  const addTagComma = () => {
    const tag = tagValue.trim().slice(0, -1);
    if (!tag) return;
    const newTags = [...(tags ?? []), tag];
    updateMaterial({ id: exactMaterial!.id, dataToUpdate: { tags: newTags } });
    setTags(newTags);
    setTagValue("");
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

  const onUpdateTitle = (newTitle: string) => {
    setTitleValue(newTitle);
    return useDebounce(
      () =>
        updateMaterial({
          id: exactMaterial!.id,
          dataToUpdate: { title: titleValue },
        }),
      500,
    );
  };

  // useEffect(() => {
  //   if (debouncedType && exactMaterial) {
  //     updateMaterial({
  //       id: exactMaterial!.id!,
  //       dataToUpdate: { type: debouncedType },
  //     });
  //   }
  //   if (debouncedStatus && exactMaterial) {
  //     updateMaterial({
  //       id: exactMaterial!.id!,
  //       dataToUpdate: { status: debouncedStatus },
  //     });
  //   }
  // }, [debouncedType, debouncedStatus]);

  // useEffect(() => {
  //   if (exactMaterial) {
  //     setTags(exactMaterial.tags);
  //     setSelectStatus(exactMaterial.status);
  //     setSelectType(exactMaterial.type);
  //   }
  // }, [exactMaterial]);

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
          initialValue={titleValue}
          titleHeading
          maxLength={20}
          onInput={() => onUpdateTitle}
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
                | "test",
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
          <EditableLink initialValue={exactMaterial.link ?? ""} />
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
                value={tagValue}
                placeholder="Tag..."
                onChange={(e) => setTagValue(e.target.value)}
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
                  e.target.value as "tolearn" | "inprocess" | "finished",
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
