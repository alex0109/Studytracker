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
import { useTranslation } from "@/shared/i18n";
import { MATERIAL_TYPES, MATERIAL_STATUSES } from "@/entities/material";

export const AddMaterialModal: FC = () => {
  const { t } = useTranslation();
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
            ? t("materials.limitReachedHint", { count: limitsData?.maxMaterials })
            : undefined
        }
        className="w-full flex justify-between items-center"
      >
        <div>
          <p>{isFull ? t("materials.limitReached") : t("materials.add")}</p>
        </div>
        <div className="flex items-center gap-2">
          <LimitCounter
            used={materialsCount}
            max={limitsData?.maxMaterials}
            label={t("limits.counter.materials")}
          />
          <LuPlus />
        </div>
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="md:w-[400px] w-[300px]">
          <Title text={t("materials.addTitle")} />
          <form
            onSubmit={handleSubmit(onFormSubmit)}
            className="flex flex-col w-full justify-center items-center"
          >
            <div className="w-full">
              <CustomInput
                label={t("materials.titleLabel")}
                placeholder={t("materials.titlePlaceholder")}
                {...register<"title">("title", { required: t("common.required") })}
                error={errors.title?.message}
              />
            </div>
            <div className="flex gap-2 flex-col justify-center">
              <select
                {...register("type")}
                className="bg-neutral-50 dark:bg-neutral-700 p-2 m-2 rounded-2xl"
              >
                {MATERIAL_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {t(`materials.types.${type}`)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 flex-col justify-center">
              <select
                {...register("status")}
                className="bg-neutral-50 dark:bg-neutral-700 p-2 m-2 rounded-2xl"
              >
                {MATERIAL_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {t(`materials.statuses.${status}`)}
                  </option>
                ))}
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
                  {t("common.create")}
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
