"use client";

import { FC } from "react";
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
  useFieldArray,
} from "react-hook-form";
import { LuCheck, LuPlus, LuX } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { cn } from "@/shared/lib";
import { MAX_OPTIONS, MIN_OPTIONS } from "@/entities/question";
import { IQuestionCreateForm } from "../../model";

interface QuestionOptionsFieldsProps {
  control: Control<IQuestionCreateForm>;
  register: UseFormRegister<IQuestionCreateForm>;
  watch: UseFormWatch<IQuestionCreateForm>;
  errors: FieldErrors<IQuestionCreateForm>;
}

export const QuestionOptionsFields: FC<QuestionOptionsFieldsProps> = ({
  control,
  register,
  watch,
  errors,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
    rules: {
      validate: (options) =>
        options.some((option) => option.isCorrect) ||
        "Mark at least one correct option",
    },
  });

  const options = watch("options");

  return (
    <div className="flex flex-col gap-2 m-2">
      <span className="text-sm text-neutral-500">
        Options: mark every correct one
      </span>
      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-col">
          <div className="flex items-center gap-2">
            <label
              title="Correct option"
              className={cn(
                "flex shrink-0 justify-center items-center size-8 rounded-lg border-2 cursor-pointer",
                options?.[index]?.isCorrect
                  ? "bg-emerald-700 border-emerald-700 text-white"
                  : "border-neutral-300 text-transparent hover:border-emerald-700",
              )}
            >
              <input
                type="checkbox"
                className="sr-only"
                {...register(`options.${index}.isCorrect`)}
              />
              <LuCheck />
            </label>
            <input
              placeholder={`*Option ${index + 1}...`}
              maxLength={500}
              className="flex-1 text-[15px] bg-gray-100 dark:bg-neutral-700 px-4 py-2 rounded-2xl"
              {...register(`options.${index}.name`, {
                validate: (value, formValues) => {
                  const name = value.trim().toLowerCase();
                  if (!name) return "Required";

                  const sameNames = formValues.options.filter(
                    (option) => option.name.trim().toLowerCase() === name,
                  );
                  return sameNames.length === 1 || "Options must be unique";
                },
              })}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title="Remove option"
              disabled={fields.length <= MIN_OPTIONS}
              onClick={() => remove(index)}
            >
              <LuX />
            </Button>
          </div>
          {errors.options?.[index]?.name && (
            <p className="text-red-400 px-12 text-sm">
              {errors.options[index]?.name?.message}
            </p>
          )}
        </div>
      ))}
      {errors.options?.root?.message && (
        <p className="text-red-400 text-sm">{errors.options.root.message}</p>
      )}
      <Button
        type="button"
        variant="ghost"
        className="self-start"
        disabled={fields.length >= MAX_OPTIONS}
        onClick={() => append({ name: "", isCorrect: false })}
      >
        <LuPlus /> Add option
      </Button>
    </div>
  );
};
