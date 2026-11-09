"use client";

import { FC, useState } from "react";
import { LuSparkles } from "react-icons/lu";
import { ChoiceGroup, Modal, Spinner } from "@/shared/ui";
import { Button } from "@/shared/radix-ui";
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

export const GenerateQuestionsModal: FC<GenerateQuestionsModalProps> = ({
  materialId,
  noteId,
  open,
  setOpen,
}) => {
  const { t } = useTranslation();

  const [count, setCount] = useState(3);
  const [questionType, setQuestionType] = useState<QuestionTypeEnum>();

  const { aiUsageData } = useAiUsage(open);
  const { isAvailable } = getFeatureUsage(
    aiUsageData,
    AiFeatureEnum.QuestionGeneration,
  );
  const { generateQuestions, generateQuestionsIsPending } =
    useQuestionsGenerate(materialId);

  const onGenerate = async () => {
    try {
      await generateQuestions({ noteId, count, questionType });
      setOpen(false);
    } catch {
      // The hook already shows the reason
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      size="md"
      icon={<LuSparkles />}
      tone="ai"
      title={t("questions.generate.title")}
      description={`${noteId ? t("questions.generate.fromNote") : t("questions.generate.fromMaterial")} ${t("questions.generate.check")}`}
      footer={
        <>
          <Button size="lg" variant="outline" onClick={() => setOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button
            size="lg"
            className="bg-violet-700 text-white hover:bg-violet-800"
            onClick={onGenerate}
            disabled={generateQuestionsIsPending || !isAvailable}
          >
            {generateQuestionsIsPending ? <Spinner /> : <LuSparkles />}
            {generateQuestionsIsPending ? t("ai.generating") : t("ai.generate")}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <ChoiceGroup
          label={t("questions.generate.howMany")}
          value={count}
          onChange={setCount}
          options={Array.from({ length: MAX_GENERATED }, (_, i) => i + 1).map((value) => ({ value, label: value }))}
        />

        <ChoiceGroup
          label={t("questions.generate.type")}
          value={questionType ?? null}
          onChange={(value) => setQuestionType(value ?? undefined)}
          options={TYPE_OPTIONS.map((option) => ({
            value: option ?? null,
            label: option ? t(`questions.types.${questionTypeKeys[option]}`) : t("questions.generate.mixed"),
          }))}
        />

        <AiUsageHint feature={AiFeatureEnum.QuestionGeneration} enabled={open} className="justify-center" />
      </div>
    </Modal>
  );
};
