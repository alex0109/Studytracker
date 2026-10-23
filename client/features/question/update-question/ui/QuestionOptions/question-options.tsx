"use client";

import { FC, useState } from "react";
import { LuCheck, LuPlus, LuTrash2, LuX } from "react-icons/lu";
import {
  IOption,
  IOptionRequest,
  MAX_OPTIONS,
  MIN_OPTIONS,
} from "@/entities/question";
import { Button } from "@/shared/radix-ui";
import { AccordionContent, IsPendingLoader } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { useQuestionUpdate } from "../../hooks/useQuestionUpdate";
import { OptionNameInput } from "./option-name-input";

interface QuestionOptionsProps {
  materialId: string;
  id: string;
  options: IOption[];
  deleteQuestion: (id: string) => void;
  openValue: boolean;
}

const toRequest = (options: IOption[]): IOptionRequest[] =>
  options.map(({ id, name, isCorrect }) => ({ id, name, isCorrect }));

export const QuestionOptions: FC<QuestionOptionsProps> = ({
  materialId,
  id,
  options,
  deleteQuestion,
  openValue,
}) => {
  const [newOptionName, setNewOptionName] = useState("");
  const { updateQuestion, updateQuestionIsPending } = useQuestionUpdate(
    materialId,
    id,
  );

  // Backend replaces the whole list, options are matched by id
  const saveOptions = (nextOptions: IOptionRequest[]) => {
    updateQuestion({ dataToUpdate: { options: nextOptions } });
  };

  const onMarkCorrect = (optionId: string) => {
    saveOptions(
      toRequest(options).map((option) => ({
        ...option,
        isCorrect: option.id === optionId,
      })),
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
    <AccordionContent
      isOpen={openValue}
      className="overflow-hidden text-base pl-[15px]
    data-[state=open]:animate-slideDown
    data-[state=closed]:animate-slideUp"
      actions={
        <Button
          size="lg"
          variant="destructive"
          onClick={() => deleteQuestion(id)}
        >
          <LuTrash2 />
        </Button>
      }
    >
      <div className="flex flex-col gap-2 pr-3">
        {options.map((option, index) => (
          <div key={option.id} className="flex items-center gap-2">
            <button
              type="button"
              title="Mark as correct"
              disabled={updateQuestionIsPending}
              onClick={() => onMarkCorrect(option.id)}
              className={cn(
                "flex shrink-0 justify-center items-center size-7 rounded-full border-2",
                option.isCorrect
                  ? "bg-emerald-700 border-emerald-700 text-white"
                  : "border-neutral-300 text-transparent hover:border-emerald-700",
              )}
            >
              <LuCheck />
            </button>
            <span className="text-sm text-neutral-500 w-4">
              {String.fromCharCode(65 + index)}.
            </span>
            <OptionNameInput
              name={option.name}
              onRename={(name) => onRename(option.id, name)}
            />
            <Button
              variant="ghost"
              size="icon"
              title="Remove option"
              disabled={options.length <= MIN_OPTIONS || updateQuestionIsPending}
              onClick={() => onRemove(option.id)}
            >
              <LuX />
            </Button>
          </div>
        ))}

        {options.length < MAX_OPTIONS && (
          <div className="flex items-center gap-2">
            <input
              value={newOptionName}
              placeholder="New option..."
              maxLength={500}
              onChange={(e) => setNewOptionName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onAdd();
                }
              }}
              className="flex-1 text-[15px] bg-gray-100 dark:bg-neutral-700 px-4 py-2 rounded-2xl"
            />
            <Button
              variant="ghost"
              disabled={!newOptionName.trim() || updateQuestionIsPending}
              onClick={onAdd}
            >
              <LuPlus /> Add
            </Button>
          </div>
        )}

        <div className="h-9">
          <IsPendingLoader isPending={updateQuestionIsPending} />
        </div>
      </div>
    </AccordionContent>
  );
};
