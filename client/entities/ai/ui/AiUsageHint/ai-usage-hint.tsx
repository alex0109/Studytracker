"use client";

import { FC } from "react";
import { LuSparkles } from "react-icons/lu";
import { cn } from "@/shared/lib";
import { useAiUsage } from "../../hooks";
import { getFeatureUsage } from "../../lib";
import { AiFeatureEnum } from "../../model";

interface AiUsageHintProps {
  feature: AiFeatureEnum;
  // Hidden modals pass false, so usage is fetched only when it is shown
  enabled?: boolean;
  className?: string;
}

// How many AI requests of this kind are left this month
export const AiUsageHint: FC<AiUsageHintProps> = ({
  feature,
  enabled = true,
  className,
}) => {
  const { aiUsageData } = useAiUsage(enabled);

  if (!aiUsageData) return null;

  const { used, limit } = getFeatureUsage(aiUsageData, feature);
  if (used === undefined || limit === undefined) return null;

  const left = Math.max(0, limit - used);
  const resetsAt = new Date(aiUsageData.resetsAt).toLocaleDateString();

  return (
    <p
      className={cn(
        "flex items-center gap-1 text-xs text-neutral-500",
        left === 0 && "text-red-500",
        className,
      )}
    >
      <LuSparkles />
      {aiUsageData.isEnabled
        ? `${left} of ${limit} AI requests left this month on ${aiUsageData.tier}, resets ${resetsAt}`
        : "AI features are turned off right now"}
    </p>
  );
};
