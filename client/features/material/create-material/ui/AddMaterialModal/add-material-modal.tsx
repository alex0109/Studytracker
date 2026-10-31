"use client";

import { FC, useState } from "react";
import { motion } from "framer-motion";
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
import { LuLink, LuPencil, LuPlus } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";
import { MATERIAL_TYPES, MATERIAL_STATUSES } from "@/entities/material";
import { cn } from "@/shared/lib";
import { ImportFromUrl } from "./import-from-url";

type Mode = "manual" | "link";

interface AddMaterialModalProps {
  // Opens the new material, e.g. right after an article was imported
  onCreated?: (materialId: string) => void;
}

export const AddMaterialModal: FC<AddMaterialModalProps> = ({ onCreated }) => {
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

  // Counted like the server: library copies take places only when the plan says so
  const materialsCount =
    materialsData?.filter((m) => limitsData?.countLibraryImports !== false || !m.isFromLibrary).length ?? 0;
  const isFull = isLimitReached(materialsCount, limitsData?.maxMaterials);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("manual");

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
          <div role="tablist" className="mx-auto mb-4 flex w-fit rounded-full bg-neutral-200/70 p-1 dark:bg-neutral-800">
            {([
              ["manual", LuPencil, t("materials.import.tabManual")],
              ["link", LuLink, t("materials.import.tabLink")],
            ] as const).map(([value, Icon, label]) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={mode === value}
                onClick={() => setMode(value)}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                  mode === value ? "text-neutral-900 dark:text-white" : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200",
                )}
              >
                {mode === value && (
                  <motion.span
                    layoutId="add-material-mode"
                    className="absolute inset-0 rounded-full bg-white shadow-sm dark:bg-neutral-700"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <Icon aria-hidden className="relative" />
                <span className="relative">{label}</span>
              </button>
            ))}
          </div>
          {mode === "link" ? (
            <ImportFromUrl
              onImported={(materialId) => {
                setOpen(false);
                setMode("manual");
                onCreated?.(materialId);
              }}
            />
          ) : (
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
          )}
        </div>
      </Modal>
    </>
  );
};
