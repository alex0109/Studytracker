"use client";

import { useTranslation } from "@/shared/i18n";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Title,
  Modal,
  CustomInput,
  IsPendingLoader,
  TextArea,
  LimitCounter,
} from "@/shared/ui";
import { Button } from "@/shared/radix-ui";
import { LuPlus } from "react-icons/lu";
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

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="md:w-[400px] w-[300px]">
          <Title text={t("dictionary.addTitle")} />
          <form
            onSubmit={handleSubmit(onFormSubmit)}
            className="flex flex-col w-full justify-center items-center"
          >
            <div className="w-full">
              <CustomInput
                placeholder={t("materials.titlePlaceholder")}
                aria-label={t("materials.titleLabel")}
                maxLength={70}
                {...register<"title">("title", {
                  required: t("common.required"),
                  validate: (value) => value.trim().length > 0 || t("common.required"),
                })}
                error={errors.title?.message}
              />
            </div>
            <div className="w-full">
              <TextArea
                inputBlockStyles="mt-2"
                inputStyles="h-[120px] px-4 py-2"
                placeholder={t("dictionary.descriptionPlaceholder")}
                aria-label={t("dictionary.description")}
                maxLength={500}
                {...register<"description">("description")}
              />
            </div>
            <div className="flex w-full justify-center items-center">
              <div className="flex-1" />
              <div className="flex-1 my-5">
                <Button
                  size="lg"
                  type="submit"
                  className="w-30"
                  disabled={createDictionaryIsPending}
                >
                  {t("common.create")}
                </Button>
              </div>
              <div className="flex-1">
                <IsPendingLoader isPending={createDictionaryIsPending} />
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};
