import { AiFeatureEnum, IAiUsage } from "../model";

// Unknown usage (still loading) never blocks, the server checks the quota anyway. A feature sold for
// credits stays available after its quota: the server then offers to pay with credits
export const getFeatureUsage = (usage: IAiUsage | undefined, feature: AiFeatureEnum) => {
  const item = usage?.features.find((x) => x.feature === feature);
  const left = item ? Math.max(0, item.limit - item.used) : undefined;
  const trialLeft = item ? Math.max(0, item.trialLimit - item.trialUsed) : undefined;

  return {
    used: item?.used,
    limit: item?.limit,
    left,
    trialLeft,
    credits: item?.credits ?? null,
    creditBlock: item?.creditBlock ?? 1,
    isAvailable: !usage || (usage.isEnabled && (!item || (left ?? 0) > 0 || (trialLeft ?? 0) > 0 || item.credits !== null)),
  };
};
