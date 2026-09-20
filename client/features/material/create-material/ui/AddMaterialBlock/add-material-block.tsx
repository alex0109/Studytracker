"use client";

import { IMaterialCreate } from "@/entities/material";
import { Button } from "@/shared/radix-ui";
import { CustomInput, IsPendingLoader, Title } from "@/shared/ui";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useMaterialCreate } from "../../hooks/useMaterialCreate";

export const AddMaterialBlock: FC = () => {
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
    <div className="flex flex-col w-[70%] rounded-2xl">
      <Title text="Add new material" />
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="flex flex-col w-full justify-center items-center"
      >
        <div className="w-[50%]">
          <CustomInput
            inputStyles={"bg-neutral-50"}
            label="Title"
            placeholder="*Title..."
            {...register<"title">("title", { required: "Required" })}
            error={errors.title?.message}
          />
        </div>
        <div className="flex gap-2 flex-col justify-center w-[50%] p-2">
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
        <div className="flex gap-2 flex-col justify-center w-[50%] p-2">
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
          <div className="flex justify-center items-center flex-1 my-5">
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
  );
};
