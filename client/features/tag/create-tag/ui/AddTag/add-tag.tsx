"use client";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { LuTag } from "react-icons/lu";
import { Field, FieldInput, Modal, LimitCounter } from "@/shared/ui";
import { ITagCreate, useTagsAll } from "@/entities/tag";
import { useLimits } from "@/entities/limits";
import { isLimitReached } from "@/shared/lib";
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

  const { createTag } = useTagCreate();
  const { tagsData } = useTagsAll();
  const { limitsData } = useLimits();

  const tagsCount = tagsData?.length ?? 0;
  const isFull = isLimitReached(tagsCount, limitsData?.maxTags);

  const [open, setOpen] = useState(false);
  const [color, setColor] = useState("#64748B");

  const onFormSubmit = (values: ITagCreate) => {
    createTag({
      ...values,
      color,
    });
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

      <Button
        onClick={() => setOpen(true)}
        disabled={isFull}
        title={
          isFull
            ? t("tags.limitReachedHint", { count: limitsData?.maxTags })
            : undefined
        }
      >
        {isFull ? t("tags.limitReached") : t("tags.new")}
        <LimitCounter
          used={tagsCount}
          max={limitsData?.maxTags}
          label={t("limits.counter.tags")}
        />
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        icon={<LuTag />}
        title={t("tags.addTitle")}
        footer={
          <>
            <Button size="lg" variant="outline" onClick={() => setOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button size="lg" type="submit" form="add-tag">
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
