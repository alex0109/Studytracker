"use client";

import { FC, useState } from "react";
import { LuSparkles } from "react-icons/lu";
import { IsPendingLoader, Modal, Title } from "@/shared/ui";
import { Button, Separator } from "@/shared/radix-ui";
import { cn } from "@/shared/lib";
import { QuestionTypeEnum, questionTypeKeys } from "@/entities/question";
import { useTranslation } from "@/shared/i18n";
import {
  AiFeatureEnum,
  AiUsageHint,
  getFeatureUsage,
  useAiUsage,
} from "@/entities/ai";
import { useQuestionsGenerate } from "../../hooks/useQuestionsGenerate";

interface GenerateQuestionsModalProps {
  materialId: string;
  // Questions are generated from this note when set, otherwise from the material
  noteId?: string;
  // Free places for questions in the material
  freeSlots: number;
  open: boolean;
  setOpen: (isOpen: boolean) => void;
}

const MAX_GENERATED = 5;

const TYPE_OPTIONS: (QuestionTypeEnum | undefined)[] = [
  undefined,
  QuestionTypeEnum.Open,
  QuestionTypeEnum.Options,
  QuestionTypeEnum.TrueFalse,
];

const selectedStyles = "bg-violet-700 text-white";
const unselectedStyles = "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300";

export const GenerateQuestionsModal: FC<GenerateQuestionsModalProps> = ({
  materialId,
  noteId,
  freeSlots,
  open,
  setOpen,
}) => {
  const { t } = useTranslation();
  const maxCount = Math.max(0, Math.min(MAX_GENERATED, freeSlots));

  const [count, setCount] = useState(3);
  const [questionType, setQuestionType] = useState<QuestionTypeEnum>();

  const { aiUsageData } = useAiUsage(open);
  const { isAvailable } = getFeatureUsage(
    aiUsageData,
    AiFeatureEnum.QuestionGeneration,
  );
  const { generateQuestions, generateQuestionsIsPending } =
    useQuestionsGenerate(materialId);

  const selectedCount = Math.min(count, maxCount);

  const onGenerate = async () => {
    try {
      await generateQuestions({ noteId, count: selectedCount, questionType });
      setOpen(false);
    } catch {
      // The hook already shows the reason
    }
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <div className="lg:w-[600px] md:w-[500px] sm:w-[400px] w-[300px] max-h-[85vh] overflow-y-auto">
        <div className="flex flex-col w-full justify-center gap-4">
          <Title text={t("questions.generate.title")} />
          <Separator />
          <p className="text-sm text-neutral-500">
            {noteId ? t("questions.generate.fromNote") : t("questions.generate.fromMaterial")}{" "}
            {t("questions.generate.check")}
          </p>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">{t("questions.generate.howMany")}</span>
            <div className="flex gap-2">
              {Array.from({ length: MAX_GENERATED }, (_, i) => i + 1).map(
                (value) => (
                  <button
                    key={value}
                    type="button"
                    disabled={value > maxCount}
                    onClick={() => setCount(value)}
                    className={cn(
                      "flex-1 rounded-xl py-2 text-sm font-medium disabled:opacity-40",
                      selectedCount === value
                        ? selectedStyles
                        : unselectedStyles,
                    )}
                  >
                    {value}
                  </button>
                ),
              )}
            </div>
            {maxCount < MAX_GENERATED && (
              <span className="text-xs text-neutral-500">
                {maxCount === 0
                  ? t("questions.generate.full")
                  : t("questions.generate.fits", { count: maxCount })}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">{t("questions.generate.type")}</span>
            <div className="flex flex-wrap gap-2">
              {TYPE_OPTIONS.map((option) => (
                <button
                  key={option ?? "mixed"}
                  type="button"
                  onClick={() => setQuestionType(option)}
                  className={cn(
                    "flex-1 rounded-xl px-3 py-2 text-sm font-medium",
                    questionType === option ? selectedStyles : unselectedStyles,
                  )}
                >
                  {option
                    ? t(`questions.types.${questionTypeKeys[option]}`)
                    : t("questions.generate.mixed")}
                </button>
              ))}
            </div>
          </div>

          <AiUsageHint
            feature={AiFeatureEnum.QuestionGeneration}
            enabled={open}
          />

          <div className="flex w-full justify-center items-center my-2">
            <div className="flex-1" />
            <div className="flex flex-1 justify-center items-center">
              <Button
                size="lg"
                className="w-50 bg-violet-700 hover:bg-violet-800"
                onClick={onGenerate}
                disabled={
                  generateQuestionsIsPending || maxCount === 0 || !isAvailable
                }
              >
                <LuSparkles />
                {generateQuestionsIsPending
                  ? t("ai.generating")
                  : t("ai.generate")}
              </Button>
            </div>
            <div className="flex-1">
              <IsPendingLoader isPending={generateQuestionsIsPending} />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
