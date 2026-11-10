"use client";

import { FC, useState } from "react";
import { motion } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
import { Modal, Field, FieldInput, FieldSelect, Spinner } from "@/shared/ui";
import { IMaterialCreate } from "@/entities/material";
import { useMaterialCreate } from "../../hooks/useMaterialCreate";
import { useMaterialImport } from "../../hooks/useMaterialImport";
import { Button } from "@/shared/radix-ui";
import { LuFilePlus, LuLink, LuPencil, LuPlus } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";
import { MATERIAL_TYPES, MATERIAL_STATUSES } from "@/entities/material";
import { cn } from "@/shared/lib";
import { ImportFromUrl } from "./import-from-url";

type Mode = "manual" | "link";

interface AddMaterialModalProps {
  // Opens the new material, e.g. right after an article was imported
  onCreated?: (materialId: string) => void;
  // "icon": a small square plus for a header, "full": a wide button with text
  variant?: "full" | "icon";
}

export const AddMaterialModal: FC<AddMaterialModalProps> = ({ onCreated, variant = "full" }) => {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    control,
  } = useForm<IMaterialCreate>({
    defaultValues: { title: "", type: MATERIAL_TYPES[0] as IMaterialCreate["type"], status: MATERIAL_STATUSES[0] as IMaterialCreate["status"] },
  });

  const { createMaterial, createMaterialIsPending } = useMaterialCreate();

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("manual");

  const { importMaterial, importMaterialIsPending } = useMaterialImport((materialId) => {
    setOpen(false);
    setMode("manual");
    onCreated?.(materialId);
  });

  const isPending = mode === "link" ? importMaterialIsPending : createMaterialIsPending;

  const onFormSubmit = (values: IMaterialCreate) => {
    // Open with a spinner until it is saved, so the click shows and can't repeat
    createMaterial(values, {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  };

  return (
    <>
      {variant === "icon" ? (
        <Button
          onClick={() => setOpen(true)}
          size="icon"
          aria-label={t("materials.add")}
          title={t("materials.add")}
          className="size-9 shrink-0 rounded-xl"
        >
          <LuPlus />
        </Button>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          className="w-full flex justify-between items-center"
        >
          <p>{t("materials.add")}</p>
          <LuPlus />
        </Button>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size="md"
        icon={<LuFilePlus />}
        title={t("materials.addTitle")}
        description={t("materials.addText")}
        footer={
          <>
            <Button size="lg" variant="outline" onClick={() => setOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button size="lg" type="submit" form={`add-material-${mode}`} disabled={isPending}>
              {isPending && <Spinner />}
              {mode === "link"
                ? importMaterialIsPending
                  ? t("materials.import.pending")
                  : t("materials.import.submit")
                : t("common.create")}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-5">
          <div role="tablist" className="flex rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800">
            {([
              ["manual", LuPencil, t("materials.import.tabManual")],
              ["link", LuLink, t("materials.import.tabLink")],
            ] as const).map(([value, Icon, label]) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={mode === value}
                disabled={isPending}
                onClick={() => setMode(value)}
                className={cn(
                  "relative flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  mode === value ? "text-neutral-900 dark:text-white" : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200",
                )}
              >
                {mode === value && (
                  <motion.span
                    layoutId="add-material-mode"
                    className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-neutral-600"
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
              id="add-material-link"
              importMaterial={importMaterial}
              importMaterialIsPending={importMaterialIsPending}
            />
          ) : (
            <form id="add-material-manual" onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4" noValidate>
              <Field label={t("materials.titleLabel")} required error={errors.title?.message}>
                <FieldInput
                  placeholder={t("materials.titleExample")}
                  aria-invalid={!!errors.title}
                  {...register("title", {
                    required: t("common.required"),
                    validate: (value) => value.trim().length > 0 || t("common.required"),
                  })}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t("materials.typeLabel")}>
                  <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                      <FieldSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        options={MATERIAL_TYPES.map((type) => ({ value: type, label: t(`materials.types.${type}`) }))}
                      />
                    )}
                  />
                </Field>
                <Field label={t("materials.statusLabel")}>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <FieldSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        options={MATERIAL_STATUSES.map((status) => ({
                          value: status,
                          label: t(`materials.statuses.${status}`),
                        }))}
                      />
                    )}
                  />
                </Field>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </>
  );
};
