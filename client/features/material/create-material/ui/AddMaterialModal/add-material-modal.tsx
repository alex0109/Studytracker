"use client";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Title,
  Modal,
  CustomInput,
  IsPendingLoader,
  LimitCounter,
} from "@/shared/ui";
import { IMaterialCreate, useMaterialAll } from "@/entities/material";
import { useLimits } from "@/entities/limits";
import { isLimitReached } from "@/shared/lib";
import { useMaterialCreate } from "../../hooks/useMaterialCreate";
import { Button } from "@/shared/radix-ui";
import { LuPlus } from "react-icons/lu";

export const AddMaterialModal: FC = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<IMaterialCreate>();

  const { createMaterial, createMaterialIsPending } = useMaterialCreate();
  const { materialsData } = useMaterialAll();
  const { limitsData } = useLimits();

  const materialsCount = materialsData?.length ?? 0;
  const isFull = isLimitReached(materialsCount, limitsData?.maxMaterials);

  const [open, setOpen] = useState(false);

  const onFormSubmit = (values: IMaterialCreate) => {
    createMaterial(values);
    setOpen(false);
    reset();
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        disabled={isFull}
        title={
          isFull
            ? `Limit reached: ${limitsData?.maxMaterials} materials. Delete one to add a new one`
            : undefined
        }
        className="w-full flex justify-between items-center"
      >
        <div>
          <p>{isFull ? "Materials limit reached" : "Add Material"}</p>
        </div>
        <div className="flex items-center gap-2">
          <LimitCounter
            used={materialsCount}
            max={limitsData?.maxMaterials}
            label="materials"
          />
          <LuPlus />
        </div>
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="md:w-[400px] w-[300px]">
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
