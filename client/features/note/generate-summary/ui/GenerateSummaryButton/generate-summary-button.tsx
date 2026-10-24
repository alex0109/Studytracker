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
            ? "Generating summary..."
            : "Generate Summary"}
        </Button>
        <IsPendingLoader isPending={generateSummaryIsPending} />
      </div>
      <AiUsageHint feature={AiFeatureEnum.SummaryGeneration} />

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <div className="md:w-[400px] w-[300px] flex flex-col gap-4">
          <Title text="Replace summary?" />
          <p className="text-sm text-neutral-500">
            AI writes a new summary from the material, its notes and
            dictionaries. The current text of this summary will be replaced.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-violet-700 hover:bg-violet-800"
              onClick={generate}
            >
              Replace
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
