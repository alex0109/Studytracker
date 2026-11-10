"use client";

import { useTranslation } from "@/shared/i18n";
import { FC, useState } from "react";
import { LuCheck, LuPlus, LuX } from "react-icons/lu";
import {
  IOption,
  IOptionRequest,
  MAX_OPTIONS,
  MIN_OPTIONS,
} from "@/entities/question";
import { Button } from "@/shared/radix-ui";
import { SaveStatus } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { useQuestionUpdate } from "../../hooks/useQuestionUpdate";
import { OptionNameInput } from "./option-name-input";
import { FieldLabel } from "../FieldLabel/field-label";

interface QuestionOptionsFieldProps {
  materialId: string;
  id: string;
  options: IOption[];
}

const toRequest = (options: IOption[]): IOptionRequest[] =>
  options.map(({ id, name, isCorrect }) => ({ id, name, isCorrect }));

export const QuestionOptionsField: FC<QuestionOptionsFieldProps> = ({
  materialId,
  id,
  options,
}) => {
  const { t } = useTranslation();
  const [newOptionName, setNewOptionName] = useState("");
  const { updateQuestion, updateQuestionIsPending, updateQuestionIsError } = useQuestionUpdate(
    materialId,
    id,
  );

  // Backend replaces the whole list, options are matched by id
  const saveOptions = (nextOptions: IOptionRequest[]) => {
    updateQuestion({ dataToUpdate: { options: nextOptions } });
  };

  const correctCount = options.filter((option) => option.isCorrect).length;

  const onToggleCorrect = (optionId: string) => {
    saveOptions(
      toRequest(options).map((option) =>
        option.id === optionId
          ? { ...option, isCorrect: !option.isCorrect }
          : option,
      ),
    );
  };

  const onRename = (optionId: string, name: string) => {
    saveOptions(
      toRequest(options).map((option) =>
        option.id === optionId ? { ...option, name } : option,
      ),
    );
  };

  const onRemove = (optionId: string) => {
    const nextOptions = toRequest(options).filter(
      (option) => option.id !== optionId,
    );

    // Removed option was the correct one, so the first left becomes correct
    if (!nextOptions.some((option) => option.isCorrect)) {
      nextOptions[0] = { ...nextOptions[0], isCorrect: true };
    }

    saveOptions(nextOptions);
  };

  const onAdd = () => {
    const name = newOptionName.trim();
    if (!name) return;

    saveOptions([...toRequest(options), { name, isCorrect: false }]);
    setNewOptionName("");
  };

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel aside={<SaveStatus isPending={updateQuestionIsPending} isError={updateQuestionIsError} />}>
        {t("questions.editor.options")}
      </FieldLabel>
      <div className="flex flex-col gap-1.5">
        {options.map((option, index) => (
          <div
            key={option.id}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-2 py-1.5 transition-colors",
              option.isCorrect
                ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/30"
                : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950",
            )}
          >
            <button
              type="button"
              aria-pressed={option.isCorrect}
              aria-label={t("questions.options.toggleCorrect")}
              title={
                option.isCorrect && correctCount === 1
                  ? t("questions.options.atLeastOne")
                  : t("questions.options.toggleCorrect")
              }
              disabled={updateQuestionIsPending || (option.isCorrect && correctCount === 1)}
              onClick={() => onToggleCorrect(option.id)}
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-lg border-2 transition-colors",
                option.isCorrect
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-neutral-300 text-transparent hover:border-emerald-600 dark:border-neutral-600",
              )}
            >
              <LuCheck />
            </button>
            <span className="w-4 text-sm text-neutral-400">{String.fromCharCode(65 + index)}</span>
            <OptionNameInput name={option.name} onRename={(name) => onRename(option.id, name)} />
            <Button
              variant="ghost"
              size="icon"
              title={t("questions.options.remove")}
              aria-label={t("questions.options.remove")}
              disabled={options.length <= MIN_OPTIONS || updateQuestionIsPending}
              onClick={() => onRemove(option.id)}
              className="size-8 text-neutral-400 hover:text-neutral-700"
            >
              <LuX />
            </Button>
          </div>
        ))}

        {options.length < MAX_OPTIONS && (
          <div className="flex items-center gap-2 rounded-xl border border-dashed border-neutral-300 px-2 py-1 dark:border-neutral-700">
            <LuPlus aria-hidden className="ml-1.5 shrink-0 text-neutral-400" />
            <input
              value={newOptionName}
              placeholder={t("questions.options.newPlaceholder")}
              aria-label={t("questions.options.add")}
              maxLength={500}
              onChange={(e) => setNewOptionName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onAdd();
                }
              }}
              className="h-9 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-neutral-400"
            />
            <Button
              variant="ghost"
              size="sm"
              disabled={!newOptionName.trim() || updateQuestionIsPending}
              onClick={onAdd}
            >
              {t("common.add")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
