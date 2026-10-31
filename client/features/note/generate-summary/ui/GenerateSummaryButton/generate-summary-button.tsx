"use client";

import { FC, useState } from "react";
import { LuSparkles } from "react-icons/lu";
import { IsPendingLoader, Modal, Title } from "@/shared/ui";
import { Button } from "@/shared/radix-ui";
import { INoteResponse } from "@/entities/note/model";
import {
  AiFeatureEnum,
  AiUsageHint,
  getFeatureUsage,
  useAiUsage,
} from "@/entities/ai";
import { useSummaryGenerate } from "../../hooks/useSummaryGenerate";
import { useTranslation } from "@/shared/i18n";

interface GenerateSummaryButtonProps {
  materialId: string;
  noteId: string;
  // The summary already has text that generation would replace
  hasContent: boolean;
  onGenerated: (note: INoteResponse) => void;
}

export const GenerateSummaryButton: FC<GenerateSummaryButtonProps> = ({
  materialId,
  noteId,
  hasContent,
  onGenerated,
}) => {
  const { t } = useTranslation();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { aiUsageData } = useAiUsage();
  const { isAvailable } = getFeatureUsage(
    aiUsageData,
    AiFeatureEnum.SummaryGeneration,
  );
  const { generateSummary, generateSummaryIsPending } = useSummaryGenerate(
    materialId,
    noteId,
  );

  const generate = async () => {
    setConfirmOpen(false);

    try {
      const response = await generateSummary();
      onGenerated(response.note);
    } catch {
      // The hook already shows the reason
    }
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center gap-3">
        <Button
          className="bg-violet-700 hover:bg-violet-800"
          disabled={generateSummaryIsPending || !isAvailable}
          onClick={() => (hasContent ? setConfirmOpen(true) : generate())}
        >
          <LuSparkles />
          {generateSummaryIsPending
            ? t("notes.summary.generating")
            : t("notes.summary.generate")}
        </Button>
        <IsPendingLoader isPending={generateSummaryIsPending} />
      </div>
      <AiUsageHint feature={AiFeatureEnum.SummaryGeneration} />

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <div className="md:w-[400px] w-[300px] flex flex-col gap-4">
          <Title text={t("notes.summary.replaceTitle")} />
          <p className="text-sm text-neutral-500">{t("notes.summary.replaceText")}</p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button
              className="bg-violet-700 hover:bg-violet-800"
              onClick={generate}
            >
              {t("notes.summary.replace")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
