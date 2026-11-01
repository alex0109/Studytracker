"use client";

import { useTranslation } from "@/shared/i18n";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Modal,
  Field,
  FieldInput,
  FieldTextArea,
  Spinner,
  LimitCounter,
} from "@/shared/ui";
import { Button } from "@/shared/radix-ui";
import { LuBookA, LuPlus } from "react-icons/lu";
import { IDictionaryCreate, useDictionaryAll } from "@/entities/dictionary";
import { useLimits } from "@/entities/limits";
import { isLimitReached } from "@/shared/lib";
import { useDictionaryCreate } from "../../hooks/useDictionaryCreate";

interface AddDictionaryModalProps {
  materialId: string;
  // Dictionaries are loaded only for the opened material
  enabled: boolean;
}

export const AddDictionaryModal: FC<AddDictionaryModalProps> = ({
  materialId,
  enabled,
}) => {
  const { t } = useTranslation();
  const { dictionariesData } = useDictionaryAll(materialId, enabled);
  const { limitsData } = useLimits();

  const dictionariesCount = dictionariesData?.length ?? 0;
  const isFull = isLimitReached(
    dictionariesCount,
    limitsData?.maxDictionariesPerMaterial,
  );

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<IDictionaryCreate>();

  const [open, setOpen] = useState(false);
  const { createDictionary, createDictionaryIsPending } =
    useDictionaryCreate(materialId);

  const onFormSubmit = (values: IDictionaryCreate) => {
    setOpen(false);
    createDictionary({
      title: values.title.trim(),
      description: values.description?.trim() || undefined,
    });
    reset();
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        disabled={isFull}
        variant="ghost"
        className="w-full flex justify-start items-center hover:bg-neutral-900/10 px-3"
      >
        <div>
          <LuPlus />
        </div>
        <div>
          <p>{isFull ? t("dictionary.limitReached") : t("dictionary.add")}</p>
        </div>
        {dictionariesData && (
          <LimitCounter
            used={dictionariesCount}
            max={limitsData?.maxDictionariesPerMaterial}
            label={t("limits.counter.dictionaries")}
            className="ml-auto"
          />
        )}
      </Button>

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
