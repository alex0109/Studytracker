"use client";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { LuBookMarked } from "react-icons/lu";
import { Field, FieldInput, Modal, Spinner } from "@/shared/ui";
import { ITagCreate } from "@/entities/tag";
import { useTagCreate } from "../../hooks/useTagCreate";
import { ColorPicker } from "../ColorPicker/color-picker";
import { Button } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";

export const AddTag: FC = () => {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<ITagCreate>();

  const { createTag, createTagIsPending } = useTagCreate();

  const [open, setOpen] = useState(false);
  const [color, setColor] = useState("#64748B");

  const onFormSubmit = (values: ITagCreate) => {
    // Open with a spinner until it is saved, so the click shows and can't repeat
    createTag(
      { ...values, color },
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
      {/* <div
        onClick={() => setOpen(true)}
        className="relative w-10 h-10 rounded-4xl bg-neutral-900 hover:bg-neutral-700 text-neutral-600 text-2xl text-center cursor-pointer"
      >
        <span className="absolute top-0.5 left-[33%] text-white">+</span>
      </div> */}

      <Button onClick={() => setOpen(true)}>{t("tags.new")}</Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        icon={<LuBookMarked />}
        title={t("tags.addTitle")}
        footer={
          <>
            <Button size="lg" variant="outline" onClick={() => setOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button size="lg" type="submit" form="add-tag" disabled={createTagIsPending}>
              {createTagIsPending && <Spinner />}
              {t("common.create")}
            </Button>
          </>
        }
      >
        <form id="add-tag" onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4" noValidate>
          <Field label={t("tags.name")} required error={errors.name?.message}>
            <span className="flex items-center gap-2">
              {/* The tag as it will look */}
              <span aria-hidden className="size-4 shrink-0 rounded-full" style={{ backgroundColor: color }} />
              <FieldInput
                placeholder={t("tags.namePlaceholder")}
                maxLength={30}
                aria-invalid={!!errors.name}
                {...register("name", {
                  required: t("common.required"),
                  validate: (value) => value.trim().length > 0 || t("common.required"),
                })}
              />
            </span>
          </Field>
          <ColorPicker value={color} onChange={setColor} />
        </form>
      </Modal>
    </>
  );
};
