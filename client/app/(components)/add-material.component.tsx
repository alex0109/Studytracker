"use client";

import { useForm } from "react-hook-form";
import BlockColumn from "../../shared/components/block-column";
import CustomInput from "../../shared/components/input";
import CustomButton from "../../shared/components/button";
import Title from "@/shared/components/title";
import { useState } from "react";
import Modal from "@/shared/components/modal";
import useMaterials from "../materials/hooks/useMaterials.hook";
import { RichTextDocument } from "../materials/services/type";

enum MaterialStatus {
  tolearn = "tolearn",
  inprocess = "inprocess",
  finished = "finished",
}

enum MaterialType {
  article = "article",
  video = "video",
  summary = "summary",
  practice = "practice",
  test = "test",
}

interface CustomFormInterface {
  title: string;
  type: string;
  link: string;
  tag: MaterialType;
  status: MaterialStatus;
  description: RichTextDocument;
}

const AddMaterial = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CustomFormInterface>();

  const { createMaterial } = useMaterials();

  const [open, setOpen] = useState(false);

  const onFormSubmit = (values: CustomFormInterface) => {
    createMaterial(values);
    setOpen(false);
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
              {/* <label className="border-l-1 border-black dark:border-white px-2">
                Type
              </label> */}
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
              {/* <label className="border-l-1 border-black dark:border-white px-2">
                Status
              </label> */}
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
            <CustomInput
              label="Tag"
              placeholder="Tag..."
              {...register<"tag">("tag")}
              error={errors.tag?.message}
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
