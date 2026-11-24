import { AiFeatureEnum } from "./ai-feature.type";
import { SubscriptionTierEnum } from "./subscription-tier.type";

// Study AI (text) and Media (podcasts, video) are shown apart: media cost far more
export type AiBucketName = "Study" | "Media";

// Units: requests, words from text, podcasts or video minutes
export interface IAiFeatureUsage {
  feature: AiFeatureEnum;
  bucket: AiBucketName;
  used: number;
  limit: number;
  // Free's media: once per account
  trialUsed: number;
  trialLimit: number;
  // Credits per block of units once the quota is used up; null: not sold for credits
  credits: number | null;
  creditBlock: number;
}

// AI of the current billing period (Stripe's for a paid plan, the calendar month on Free) and the credit wallet
export interface IAiUsage {
  tier: SubscriptionTierEnum;
  isEnabled: boolean;
  periodStart: string;
  resetsAt: string;
  features: IAiFeatureUsage[];
  creditBalance: number;
  // Study AI takes credits without asking once its quota is used up
  autoUseCredits: boolean;
}

export type AiDenialCode = "quota_exhausted" | "insufficient_credits" | "trial_used" | "input_too_large";

// The body of a 402: why an AI request can't run and what would let it
export interface IAiDenial {
  code: AiDenialCode;
  feature: AiFeatureEnum;
  bucket: AiBucketName;
  remaining: number;
  creditsRequired: number | null;
  creditBalance: number;
  maxInputChars?: number;
}
