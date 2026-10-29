"use client";

import { FC } from "react";
import { LuSparkles } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { IsPendingLoader } from "@/shared/ui";
import { IResultResponse } from "@/entities/attempt";
import {
  AiFeatureEnum,
  AiUsageHint,
  getFeatureUsage,
  useAiUsage,
} from "@/entities/ai";
import { useMistakesExplain } from "../../hooks/useMistakesExplain";
import { useTranslation } from "@/shared/i18n";

interface ExplainMistakesButtonProps {
  attemptId: string;
  results: IResultResponse[];
}

export const ExplainMistakesButton: FC<ExplainMistakesButtonProps> = ({
  attemptId,
  results,
}) => {
  const { t } = useTranslation();
  const mistakes = results.filter((result) => !result.isCorrect);
  const notExplained = mistakes.filter((result) => !result.aiExplanation);

  const { aiUsageData } = useAiUsage(mistakes.length > 0);
  const { isAvailable } = getFeatureUsage(
    aiUsageData,
    AiFeatureEnum.MistakeExplanation,
  );
  const { explainMistakes, explainMistakesIsPending } =
    useMistakesExplain(attemptId);

  if (mistakes.length === 0) return null;

  const isExplained = notExplained.length === 0;

  return (
    <div className="flex flex-col items-center gap-2 my-3">
      <div className="flex items-center gap-3">
        <Button
          size="lg"
          className="h-12 rounded-2xl bg-violet-700 hover:bg-violet-800"
          disabled={explainMistakesIsPending || isExplained || !isAvailable}
          onClick={() => explainMistakes()}
        >
          <LuSparkles />
          {explainMistakesIsPending
            ? t("results.explain.pending")
            : isExplained
              ? t("results.explain.done")
              : t("results.explain.button", { count: notExplained.length })}
        </Button>
        <IsPendingLoader isPending={explainMistakesIsPending} />
      </div>
      {!isExplained && (
        <AiUsageHint feature={AiFeatureEnum.MistakeExplanation} />
      )}
    </div>
  );
};
