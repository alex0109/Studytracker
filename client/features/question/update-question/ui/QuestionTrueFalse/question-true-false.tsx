"use client";

import { FC } from "react";
import { LuTrash2 } from "react-icons/lu";
import { IOption } from "@/entities/question";
import { Button } from "@/shared/radix-ui";
import { AccordionContent, IsPendingLoader } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { useQuestionUpdate } from "../../hooks/useQuestionUpdate";

interface QuestionTrueFalseProps {
  materialId: string;
  id: string;
  options: IOption[];
  deleteQuestion: (id: string) => void;
  openValue: boolean;
}

export const QuestionTrueFalse: FC<QuestionTrueFalseProps> = ({
  materialId,
  id,
  options,
  deleteQuestion,
  openValue,
}) => {
  const { updateQuestion, updateQuestionIsPending } = useQuestionUpdate(
    materialId,
    id,
  );

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
        <span className="text-sm text-neutral-500">This statement is</span>
        <div className="flex items-center gap-2">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              disabled={updateQuestionIsPending || option.isCorrect}
              onClick={() =>
                updateQuestion({ dataToUpdate: { correctOptionId: option.id } })
              }
              className={cn(
                "flex-1 rounded-xl py-2 text-sm font-medium",
                option.isCorrect
                  ? "bg-emerald-700 text-white"
                  : "bg-neutral-200 text-neutral-700",
              )}
            >
              {option.name}
            </button>
          ))}
          <div className="w-9">
            <IsPendingLoader isPending={updateQuestionIsPending} />
          </div>
        </div>
      </div>
    </AccordionContent>
  );
};
