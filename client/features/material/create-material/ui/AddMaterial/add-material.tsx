"use client";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { Title, Modal, CustomInput, IsPendingLoader } from "@/shared/ui";
import { IMaterialCreate } from "@/entities/material";
import { useMaterialCreate } from "../../hooks/useMaterialCreate";
import { Button } from "@/shared/radix-ui";

export const AddMaterial: FC = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<IMaterialCreate>();

  const { createMaterial, createMaterialIsPending } = useMaterialCreate();

  const [open, setOpen] = useState(false);

  const onFormSubmit = (values: IMaterialCreate) => {
    createMaterial(values);
    setOpen(false);
    reset();
  };

  return (
    <>
      {/* <div
        onClick={() => setOpen(true)}
        className="relative w-10 h-10 rounded-4xl bg-neutral-900 hover:bg-neutral-700 text-neutral-600 text-2xl text-center cursor-pointer"
      >
        <span className="absolute top-0.5 left-[33%] text-white">+</span>
      </div> */}

      <Button onClick={() => setOpen(true)}>New Material</Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="w-[400px]">
          <Title text="Add new material" />
          <form
            onSubmit={handleSubmit(onFormSubmit)}
            className="flex flex-col w-full justify-center items-center"
          >
            <div className="w-full">
              <CustomInput
                label="Title"
                placeholder="*Title..."
                {...register<"title">("title", { required: "Required" })}
                error={errors.title?.message}
              />
            </div>
            <div className="flex gap-2 flex-col justify-center">
              <select
                {...register("type")}
                className="bg-gray-50 dark:bg-neutral-700 p-2 m-2 rounded-2xl"
              >
                <option value="article">📄Article</option>
                <option value="video">▶️Video</option>
                <option value="summary">📚Summary</option>
                <option value="practice">📝Practice</option>
                <option value="test">✏️Test</option>
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
            <div className="flex w-full justify-center items-center">
              <div className="flex-1" />
              <div className="flex-1 my-5">
                <Button
                  size="lg"
                  type="submit"
                  className="w-30"
                  disabled={createMaterialIsPending}
                >
                  Create
                </Button>
              </div>
              <div className="flex-1">
                <IsPendingLoader isPending={createMaterialIsPending} />
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};
