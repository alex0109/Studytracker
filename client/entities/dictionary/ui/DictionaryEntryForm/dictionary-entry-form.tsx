"use client";

import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { LuChevronDown } from "react-icons/lu";
import { Field, FieldInput, FieldSelect, FieldTextArea } from "@/shared/ui";
import { IDictionaryEntryForm } from "../../model";
import { partOfSpeechOptions } from "../../lib";
import { useTranslation } from "react-i18next";

interface DictionaryEntryFormProps {
  // The dialog's footer submits it through form={id}
  id: string;
  defaultValues?: IDictionaryEntryForm;
  onSubmit: (values: IDictionaryEntryForm) => void;
}

// What a word needs first is on top, the rest waits under "More details": nine equal fields
// in a grid made the word itself hard to find
export const DictionaryEntryForm: FC<DictionaryEntryFormProps> = ({ id, defaultValues, onSubmit }) => {
  const { t } = useTranslation();
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<IDictionaryEntryForm>({ defaultValues });

  const required = {
    required: t("common.required"),
    validate: (value?: string) => !!value?.trim() || t("common.required"),
  };

  // Editing a word that already has them: the details are open, nothing is hidden
  const hasDetails = !!(defaultValues?.grammarInfo || defaultValues?.synonyms || defaultValues?.note);

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("dictionary.form.term")} required error={errors.term?.message}>
          <FieldInput maxLength={200} aria-invalid={!!errors.term} {...register("term", required)} />
        </Field>
        <Field label={t("dictionary.form.translation")} required error={errors.translation?.message}>
          <FieldInput maxLength={200} aria-invalid={!!errors.translation} {...register("translation", required)} />
        </Field>
        <Field label={t("dictionary.form.transcription")}>
          <FieldInput
            maxLength={200}
            placeholder={t("dictionary.form.transcriptionPlaceholder")}
            {...register("transcription")}
          />
        </Field>
        <Field label={t("dictionary.form.partOfSpeech")}>
          <Controller
            control={control}
            name="partOfSpeech"
            render={({ field }) => (
              <FieldSelect
                value={field.value ?? ""}
                onValueChange={field.onChange}
                options={[
                  { value: "", label: t("dictionary.form.partOfSpeechNone") },
                  ...partOfSpeechOptions.map((option) => ({
                    value: option,
                    label: t(`dictionary.partOfSpeech.${option}`),
                  })),
                ]}
              />
            )}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("dictionary.form.example")}>
          <FieldInput maxLength={500} {...register("example")} />
        </Field>
        <Field label={t("dictionary.form.exampleTranslation")}>
          <FieldInput maxLength={500} {...register("exampleTranslation")} />
        </Field>
      </div>

      <details
        open={hasDetails}
        className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 [&>summary::-webkit-details-marker]:hidden"
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 rounded-2xl px-4 py-3 text-sm select-none hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
          <span className="font-medium text-neutral-700 dark:text-neutral-300">{t("dictionary.form.more")}</span>
          <span className="truncate text-neutral-400">{t("dictionary.form.moreHint")}</span>
          <LuChevronDown aria-hidden className="ml-auto size-4 shrink-0 text-neutral-400 transition group-open:rotate-180" />
        </summary>
        <div className="grid gap-4 px-4 pt-1 pb-4 sm:grid-cols-2">
          <Field label={t("dictionary.form.grammar")} hint={t("dictionary.form.grammarHint")}>
            <FieldInput maxLength={300} {...register("grammarInfo")} />
          </Field>
          <Field label={t("dictionary.form.synonyms")} hint={t("dictionary.form.synonymsHint")}>
            <FieldInput {...register("synonyms")} />
          </Field>
          <Field label={t("dictionary.form.note")} className="sm:col-span-2">
            <FieldTextArea maxLength={1000} rows={3} {...register("note")} />
          </Field>
        </div>
      </details>
    </form>
  );
};
