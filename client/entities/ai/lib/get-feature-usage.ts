import { AiFeatureEnum, IAiUsage } from "../model";

// Unknown usage (still loading) never blocks, the server checks the quota anyway
export const getFeatureUsage = (
  usage: IAiUsage | undefined,
  feature: AiFeatureEnum,
) => {
  const item = usage?.features.find((x) => x.feature === feature);

  return {
    used: item?.used,
    limit: item?.limit,
    isAvailable:
      !usage || (usage.isEnabled && (!item || item.used < item.limit)),
  };
};
