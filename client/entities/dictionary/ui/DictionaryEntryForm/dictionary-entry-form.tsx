"use client";

import { FC } from "react";
import { useForm } from "react-hook-form";
import { CustomInput, IsPendingLoader, TextArea } from "@/shared/ui";
import { Button } from "@/shared/radix-ui";
import { IDictionaryEntryForm } from "../../model";
import { partOfSpeechOptions } from "../../lib";

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
          placeholder="*Word..."
          maxLength={200}
          {...register<"term">("term", {
            required: "Required",
            validate: (value) => value.trim().length > 0 || "Required",
          })}
          error={errors.term?.message}
        />
        <CustomInput
          placeholder="*Translation..."
          maxLength={200}
          {...register<"translation">("translation", {
            required: "Required",
            validate: (value) => value.trim().length > 0 || "Required",
          })}
          error={errors.translation?.message}
        />
        <CustomInput
          placeholder="Transcription..."
          maxLength={200}
          {...register<"transcription">("transcription")}
        />
        <select
          {...register("partOfSpeech")}
          className="bg-gray-100 dark:bg-neutral-700 px-4 py-2 my-2 rounded-2xl text-[15px] cursor-pointer"
        >
          <option value="">Part of speech...</option>
          {partOfSpeechOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <CustomInput
          placeholder="Example..."
          maxLength={500}
          {...register<"example">("example")}
        />
        <CustomInput
          placeholder="Example translation..."
          maxLength={500}
          {...register<"exampleTranslation">("exampleTranslation")}
        />
        <CustomInput
          placeholder="Grammar info (e.g. plural: mice)..."
          maxLength={300}
          {...register<"grammarInfo">("grammarInfo")}
        />
        <CustomInput
          placeholder="Synonyms, comma separated..."
          {...register<"synonyms">("synonyms")}
        />
      </div>
      <TextArea
        inputBlockStyles="mt-2"
        inputStyles="h-[120px] px-4 py-2"
        placeholder="Note..."
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
