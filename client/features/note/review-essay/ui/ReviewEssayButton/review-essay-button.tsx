"use client";

import { FC } from "react";
import { LuSparkles } from "react-icons/lu";
import { Spinner } from "@/shared/ui";
import { Button } from "@/shared/radix-ui";
import { cn } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";
import { AiFeatureEnum, AiUsageHint, getFeatureUsage, useAiUsage } from "@/entities/ai";
import { ESSAY_MIN_WORDS } from "@/entities/note";
import { useEssayReview } from "../../hooks/useEssayReview";

interface ReviewEssayButtonProps {
  materialId: string;
  noteId: string;
  // Words in the saved text; fewer than the minimum can't be checked
  wordCount: number;
  hasReview: boolean;
  className?: string;
}

export const ReviewEssayButton: FC<ReviewEssayButtonProps> = ({
  materialId,
  noteId,
  wordCount,
  hasReview,
  className,
}) => {
  const { t } = useTranslation();
  const { aiUsageData } = useAiUsage();
  const { isAvailable } = getFeatureUsage(aiUsageData, AiFeatureEnum.EssayReview);
  const { reviewEssay, reviewEssayIsPending } = useEssayReview(materialId, noteId);

  const missingWords = Math.max(0, ESSAY_MIN_WORDS - wordCount);

  return (
    <div className={cn("flex flex-col items-start gap-1.5", className)}>
      <Button
        size="lg"
        className="bg-violet-700 text-white hover:bg-violet-800 dark:bg-violet-600 dark:text-white dark:hover:bg-violet-500"
        disabled={reviewEssayIsPending || !isAvailable || missingWords > 0}
        onClick={() => reviewEssay()}
      >
        {reviewEssayIsPending ? <Spinner /> : <LuSparkles />}
        {reviewEssayIsPending
          ? t("notes.essay.checking")
          : hasReview
            ? t("notes.essay.checkAgain")
            : t("notes.essay.check")}
      </Button>
      {missingWords > 0 ? (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {t("notes.essay.needMore", { count: missingWords })}
        </p>
      ) : (
        <AiUsageHint feature={AiFeatureEnum.EssayReview} />
      )}
    </div>
  );
};
