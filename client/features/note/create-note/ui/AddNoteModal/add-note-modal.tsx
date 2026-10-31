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
import { useLimits } from "@/entities/limits";
import { isLimitReached } from "@/shared/lib";
import { Button } from "@/shared/radix-ui";
import { LuPlus } from "react-icons/lu";
import { INoteCreate } from "@/entities/note/model";
import { useNoteCreate } from "../../hooks/useNoteCreate";
import { useTranslation } from "@/shared/i18n";

interface AddNoteModalProps {
  materialId: string;
  notesCount: number;
  // A material has at most one summary
  hasSummary: boolean;
}

export const AddNoteModal: FC<AddNoteModalProps> = ({
  materialId,
  notesCount,
  hasSummary,
}) => {
  const { t } = useTranslation();
  const { limitsData } = useLimits();
  const isFull = isLimitReached(notesCount, limitsData?.maxNotesPerMaterial);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<INoteCreate>();

  const [open, setOpen] = useState(false);
  const { createNote, createNoteIsPending } = useNoteCreate(materialId);

  const onFormSubmit = (values: INoteCreate) => {
    setOpen(false);
    createNote(values);
    reset();
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        disabled={isFull}
        variant="ghost"
        className="w-full flex justify-start items-center hover:bg-neutral-900/10 dark:hover:bg-white/10 px-3"
      >
        <div>
          <LuPlus />
        </div>
        <div>
          <p>{isFull ? t("notes.limitReached") : t("notes.add")}</p>
        </div>
        <LimitCounter
          used={notesCount}
          max={limitsData?.maxNotesPerMaterial}
          label={t("limits.counter.notes")}
          className="ml-auto"
        />
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="md:w-[400px] w-[300px]">
          <Title text={t("notes.addTitle")} />
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
                <option value="text">{t("notes.types.text")}</option>
                <option value="drawing">{t("notes.types.drawing")}</option>
                {!hasSummary && (
                  <option value="summary">{t("notes.types.summary")}</option>
                )}
              </select>
            </div>
            <div className="flex w-full justify-center items-center">
              <div className="flex-1" />
              <div className="flex-1 my-5">
                <Button
                  size="lg"
                  type="submit"
                  className="w-30"
                  disabled={createNoteIsPending}
                >
                  {t("common.create")}
                </Button>
              </div>
              <div className="flex-1">
                <IsPendingLoader isPending={createNoteIsPending} />
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};
