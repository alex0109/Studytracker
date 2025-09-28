"use client";

import { useForm, Controller } from "react-hook-form";
import BlockColumn from "../../shared/components/block-column";
import CustomInput from "../../shared/components/input";
import CustomButton from "../../shared/components/button";
import Title from "@/shared/components/title";
import { FC, useState } from "react";
import Modal from "@/shared/components/modal";
import useMaterials from "../materials/hooks/useMaterials.hook";
import { RichTextDocument } from "../materials/services/type";

enum MaterialStatusEnum {
  tolearn = "tolearn",
  inprocess = "inprocess",
  finished = "finished",
}

enum MaterialTypeEnum {
  article = "article",
  video = "video",
  summary = "summary",
  practice = "practice",
  test = "test",
}

interface CustomFormInterface {
  title: string;
  type: MaterialTypeEnum;
  link: string;
  tags: string[];
  status: MaterialStatusEnum;
  description: RichTextDocument;
}

const AddMaterial: FC = () => {
  const [value, setValue] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<CustomFormInterface>({
    defaultValues: {
      tags: [],
    },
  });

  const { createMaterial } = useMaterials();

  const [open, setOpen] = useState(false);

  const onFormSubmit = (values: CustomFormInterface) => {
    createMaterial(values);
    setOpen(false);
    setTags([]);
    reset();
  };

  return (
    <BlockColumn>
      <Title text="Add new material" />
      <div
        onClick={() => setOpen(true)}
        className="w-full h-[100px] border-3 border-neutral-600 border-dashed rounded-xl flex justify-center items-center cursor-pointer"
      >
        <p className="text-neutral-600 text-2xl text-center">+</p>
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="w-[400px]">
          <Title text="Add new material" />
          <form
            onSubmit={handleSubmit(onFormSubmit)}
            className="justify-center items-center"
          >
            <CustomInput
              label="Title"
              placeholder="*Title..."
              {...register<"title">("title", { required: "Required" })}
              error={errors.title?.message}
            />
            <div className="flex gap-2 flex-col justify-center">
              <select
                {...register("type")}
                className="bg-gray-50 dark:bg-neutral-700 p-2 m-2 rounded-2xl"
              >
                <option value="article">Article</option>
                <option value="video">Video</option>
                <option value="summary">Summary</option>
                <option value="practice">Practice</option>
                <option value="test">Test</option>
              </select>
            </div>
            <div className="flex gap-2 flex-col justify-center">
              <select
                {...register("status")}
                className="bg-gray-50 dark:bg-neutral-700 p-2 m-2 rounded-2xl"
              >
                <option value="tolearn">Want to learn</option>
                <option value="inprocess">In process</option>
                <option value="finished">Finished</option>
              </select>
            </div>
            <CustomInput
              label="Link"
              placeholder="Link..."
              {...register<"link">("link")}
              error={errors.link?.message}
            />
            {/* <CustomInput
              label="Tags"
              placeholder="Tags..."
              {...register<"tags">("tags")}
              error={errors.tags?.message}
            /> */}

            <Controller
              control={control}
              name="tags"
              render={({ field }) => {
                const ENTER = "Enter";
                const BACKSPACE = "Backspace";
                const COMMA = ",";

                const addTag = () => {
                  const tag = value.trim().slice(0, -1);
                  if (!tag) return;
                  const newTags = [...tags, tag];
                  setTags(newTags);
                  field.onChange(newTags);
                  setValue("");
                };

                const editTag = () => {
                  const last = tags[tags.length - 1];
                  setValue(last || "");
                  const newTags = tags.slice(0, -1);
                  setTags(newTags);
                  field.onChange(newTags);
                };

                const handleKeyUp = (
                  e: React.KeyboardEvent<HTMLInputElement>
                ) => {
                  const key = e.key;
                  if (key === ENTER || key === COMMA) {
                    addTag();
                  }
                };

                const handleKeyDown = (
                  e: React.KeyboardEvent<HTMLInputElement>
                ) => {
                  const key = e.key;
                  if (key === BACKSPACE && !value) {
                    editTag();
                  }
                };

                return (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={value}
                      placeholder="Tag..."
                      onChange={(e) => setValue(e.target.value)}
                      onKeyUp={handleKeyUp}
                      onKeyDown={handleKeyDown}
                      className="text-[15px]bg-gray-100 dark:bg-neutral-700 px-4 py-2 my-2 rounded-2xl"
                    />
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, i) => (
                        <span
                          key={i}
                          className="bg-blue-200 text-blue-800 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              }}
            />

            <CustomInput
              label="Description"
              placeholder="Description..."
              {...register<"description">("description")}
              error={errors.description?.message}
            />

            <CustomButton
              title="Submit"
              type="submit"
              onClick={() => setOpen(true)}
            />
          </form>
        </div>
      </Modal>
    </BlockColumn>
  );
};

export default AddMaterial;
