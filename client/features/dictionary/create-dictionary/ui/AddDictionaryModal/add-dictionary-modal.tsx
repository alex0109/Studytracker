"use client";

import { useTranslation } from "@/shared/i18n";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { Modal, Field, FieldInput, FieldTextArea, Spinner } from "@/shared/ui";
import { Button } from "@/shared/radix-ui";
import { LuBookA, LuPlus } from "react-icons/lu";
import { IDictionaryCreate } from "@/entities/dictionary";
import { useDictionaryCreate } from "../../hooks/useDictionaryCreate";

interface AddDictionaryModalProps {
  materialId: string;
  // "icon": a small plus for a section header, "row": a full-width list row
  variant?: "row" | "icon";
}

export const AddDictionaryModal: FC<AddDictionaryModalProps> = ({ materialId, variant = "row" }) => {
  const { t } = useTranslation();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<IDictionaryCreate>();

  const [open, setOpen] = useState(false);
  const { createDictionary, createDictionaryIsPending } =
    useDictionaryCreate(materialId);

  // Open with a spinner until it is saved, so the click shows and can't repeat
  const onFormSubmit = (values: IDictionaryCreate) => {
    createDictionary(
      {
        title: values.title.trim(),
        description: values.description?.trim() || undefined,
      },
      {
        onSuccess: () => {
          setOpen(false);
          reset();
        },
      },
    );
  };

  return (
    <>
      {variant === "icon" ? (
        <Button
          onClick={() => setOpen(true)}
          variant="ghost"
          size="icon"
          aria-label={t("dictionary.add")}
          title={t("dictionary.add")}
          className="size-7 rounded-lg text-neutral-500 hover:bg-neutral-900/10 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <LuPlus />
        </Button>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          variant="ghost"
          className="h-8 w-full min-w-0 flex justify-start items-center px-2 font-normal text-neutral-600 hover:bg-neutral-900/10 dark:text-neutral-300 dark:hover:bg-white/10"
        >
          <div>
            <LuPlus />
          </div>
          <div className="min-w-0">
            <p className="truncate">{t("dictionary.add")}</p>
          </div>
        </Button>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        icon={<LuBookA />}
        title={t("dictionary.addTitle")}
        description={t("dictionary.addText")}
        footer={
          <>
            <Button size="lg" variant="outline" onClick={() => setOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button size="lg" type="submit" form="add-dictionary" disabled={createDictionaryIsPending}>
              {createDictionaryIsPending && <Spinner />}
              {t("common.create")}
            </Button>
          </>
        }
      >
        <form id="add-dictionary" onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4" noValidate>
          <Field label={t("materials.titleLabel")} required error={errors.title?.message}>
            <FieldInput
              placeholder={t("dictionary.titlePlaceholder")}
              maxLength={70}
              aria-invalid={!!errors.title}
              {...register("title", {
                required: t("common.required"),
                validate: (value) => value.trim().length > 0 || t("common.required"),
              })}
            />
          </Field>
          <Field label={t("dictionary.description")}>
            <FieldTextArea
              placeholder={t("dictionary.descriptionAdd")}
              maxLength={500}
              rows={3}
              {...register("description")}
            />
          </Field>
        </form>
      </Modal>
    </>
  );
};
