import { AiFeatureEnum } from "./ai-feature.type";
import { SubscriptionTierEnum } from "./subscription-tier.type";

export interface IAiFeatureUsage {
  feature: AiFeatureEnum;
  used: number;
  limit: number;
}

// Monthly AI quota of the current user, resets on the first day of a month (UTC)
export interface IAiUsage {
  tier: SubscriptionTierEnum;
  isEnabled: boolean;
  periodStart: string;
  resetsAt: string;
  features: IAiFeatureUsage[];
}
