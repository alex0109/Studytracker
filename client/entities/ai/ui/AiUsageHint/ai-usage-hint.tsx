"use client";

import { FC } from "react";
import { LuCoins, LuSparkles } from "react-icons/lu";
import { cn } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";
import { useAiUsage } from "../../hooks";
import { getFeatureUsage } from "../../lib";
import { AiFeatureEnum } from "../../model";

interface AiUsageHintProps {
  feature: AiFeatureEnum;
  // Hidden modals pass false, so usage is fetched only when it is shown
  enabled?: boolean;
  className?: string;
}

// What the next request of this feature takes: a place in the quota, the one-time trial, or credits
export const AiUsageHint: FC<AiUsageHintProps> = ({ feature, enabled = true, className }) => {
  const { t, i18n } = useTranslation();
  const { aiUsageData } = useAiUsage(enabled);

  if (!aiUsageData) return null;

  const { limit, left, trialLeft, credits, creditBlock } = getFeatureUsage(aiUsageData, feature);
  if (limit === undefined || left === undefined) return null;

  const date = new Date(aiUsageData.resetsAt).toLocaleDateString(i18n.language);
  const unitName = t(`ai.units.${feature}`);
  const unit = unitName ? ` ${unitName}` : "";
  const values = { left, limit, date, unit, credits, block: creditBlock, balance: aiUsageData.creditBalance };
  const paysWithCredits = left === 0 && !trialLeft && credits !== null;

  const text = !aiUsageData.isEnabled
    ? t("ai.off")
    : left > 0
      ? t("ai.cost.quota", values)
      : trialLeft
        ? t("ai.cost.trial", { ...values, left: trialLeft })
        : credits !== null
          ? t(creditBlock > 1 ? "ai.cost.creditsPerBlock" : "ai.cost.credits", values)
          : t("ai.cost.none", values);

  return (
    <p
      className={cn(
        "flex items-center gap-1 text-xs text-neutral-500",
        paysWithCredits && "text-amber-600 dark:text-amber-400",
        left === 0 && !trialLeft && credits === null && "text-red-500",
        className,
      )}
    >
      {paysWithCredits ? <LuCoins aria-hidden /> : <LuSparkles aria-hidden />}
      {text}
    </p>
  );
};
