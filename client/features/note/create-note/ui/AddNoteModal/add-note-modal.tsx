"use client";

import { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ChoiceGroup,
  Modal,
  Field,
  FieldInput,
  Spinner,
  LimitCounter,
} from "@/shared/ui";
import { useLimits } from "@/entities/limits";
import { isLimitReached } from "@/shared/lib";
import { Button } from "@/shared/radix-ui";
import { LuNotebookPen, LuPlus } from "react-icons/lu";
import { INoteCreate, NoteTypeEnum } from "@/entities/note/model";
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
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<INoteCreate>({ defaultValues: { title: "", type: NoteTypeEnum.text } });

  const [open, setOpen] = useState(false);
  const { createNote, createNoteIsPending } = useNoteCreate(materialId);

  const onFormSubmit = (values: INoteCreate) => {
    // Open with a spinner until it is saved, so the click shows and can't repeat
    createNote(values, {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        disabled={isFull}
        variant="ghost"
        className="h-8 w-full min-w-0 flex justify-start items-center px-2 font-normal text-neutral-600 hover:bg-neutral-900/10 dark:text-neutral-300 dark:hover:bg-white/10"
      >
        <div>
          <LuPlus />
        </div>
        <div className="min-w-0">
          <p className="truncate">{isFull ? t("notes.limitReached") : t("notes.add")}</p>
        </div>
        <LimitCounter
          used={notesCount}
          max={limitsData?.maxNotesPerMaterial}
          label={t("limits.counter.notes")}
          className="ml-auto"
        />
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        icon={<LuNotebookPen />}
        title={t("notes.addTitle")}
        footer={
          <>
            <Button size="lg" variant="outline" onClick={() => setOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button size="lg" type="submit" form="add-note" disabled={createNoteIsPending}>
              {createNoteIsPending && <Spinner />}
              {t("common.create")}
            </Button>
          </>
        }
      >
        <form id="add-note" onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4" noValidate>
          <Field label={t("materials.titleLabel")} required error={errors.title?.message}>
            <FieldInput
              placeholder={t("notes.titleExample")}
              aria-invalid={!!errors.title}
              {...register("title", {
                required: t("common.required"),
                validate: (value) => value.trim().length > 0 || t("common.required"),
              })}
            />
          </Field>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <ChoiceGroup
                label={t("notes.typeLabel")}
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: NoteTypeEnum.text, label: t("notes.types.text") },
                  { value: NoteTypeEnum.drawing, label: t("notes.types.drawing") },
                  // One summary per material
                  ...(hasSummary ? [] : [{ value: NoteTypeEnum.summary, label: t("notes.types.summary") }]),
                ]}
              />
            )}
          />
        </form>
      </Modal>
    </>
  );
};
