"use client";

import { FC } from "react";
import { useForm } from "react-hook-form";
import { CustomInput, IsPendingLoader, TextArea } from "@/shared/ui";
import { Button } from "@/shared/radix-ui";
import { IDictionaryEntryForm } from "../../model";
import { partOfSpeechOptions } from "../../lib";
import { useTranslation } from "react-i18next";

interface DictionaryEntryFormProps {
  defaultValues?: IDictionaryEntryForm;
  submitText: string;
  isPending: boolean;
  resetOnSubmit?: boolean;
  onSubmit: (values: IDictionaryEntryForm) => void;
}

export const DictionaryEntryForm: FC<DictionaryEntryFormProps> = ({
  defaultValues,
  submitText,
  isPending,
  resetOnSubmit,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<IDictionaryEntryForm>({ defaultValues });

  const onFormSubmit = (values: IDictionaryEntryForm) => {
    onSubmit(values);
    if (resetOnSubmit) reset();
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col">
      <div className="grid md:grid-cols-2 grid-cols-1 md:gap-x-3">
        <CustomInput
          placeholder={t("dictionary.form.term")}
          aria-label={t("dictionary.form.term")}
          maxLength={200}
          {...register<"term">("term", {
            required: t("common.required"),
            validate: (value) => value.trim().length > 0 || t("common.required"),
          })}
          error={errors.term?.message}
        />
        <CustomInput
          placeholder={t("dictionary.form.translation")}
          aria-label={t("dictionary.form.translation")}
          maxLength={200}
          {...register<"translation">("translation", {
            required: t("common.required"),
            validate: (value) => value.trim().length > 0 || t("common.required"),
          })}
          error={errors.translation?.message}
        />
        <CustomInput
          placeholder={t("dictionary.form.transcription")}
          aria-label={t("dictionary.form.transcription")}
          maxLength={200}
          {...register<"transcription">("transcription")}
        />
        <select
          {...register("partOfSpeech")}
          className="bg-neutral-100 dark:bg-neutral-700 px-4 py-2 my-2 rounded-2xl text-[15px] cursor-pointer"
        >
          <option value="">{t("dictionary.form.partOfSpeech")}</option>
          {partOfSpeechOptions.map((option) => (
            <option key={option} value={option}>
              {t(`dictionary.partOfSpeech.${option}`)}
            </option>
          ))}
        </select>
        <CustomInput
          placeholder={t("dictionary.form.example")}
          aria-label={t("dictionary.form.example")}
          maxLength={500}
          {...register<"example">("example")}
        />
        <CustomInput
          placeholder={t("dictionary.form.exampleTranslation")}
          aria-label={t("dictionary.form.exampleTranslation")}
          maxLength={500}
          {...register<"exampleTranslation">("exampleTranslation")}
        />
        <CustomInput
          placeholder={t("dictionary.form.grammar")}
          aria-label={t("dictionary.form.grammar")}
          maxLength={300}
          {...register<"grammarInfo">("grammarInfo")}
        />
        <CustomInput
          placeholder={t("dictionary.form.synonyms")}
          aria-label={t("dictionary.form.synonyms")}
          {...register<"synonyms">("synonyms")}
        />
      </div>
      <TextArea
        inputBlockStyles="mt-2"
        inputStyles="h-[120px] px-4 py-2"
        placeholder={t("dictionary.form.note")}
        aria-label={t("dictionary.form.note")}
        maxLength={1000}
        defaultValue={defaultValues?.note}
        {...register<"note">("note")}
      />
      <div className="flex w-full justify-center items-center">
        <div className="flex-1" />
        <div className="flex flex-1 justify-center items-center">
          <Button size="lg" type="submit" className="w-50" disabled={isPending}>
            {submitText}
          </Button>
        </div>
        <div className="flex-1">
          <IsPendingLoader isPending={isPending} />
        </div>
      </div>
    </form>
  );
};
