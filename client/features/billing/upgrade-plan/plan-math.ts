import { BillingIntervalName, IBillingPlan, IBillingPrice, priceIn } from "@/entities/billing";

// AI for studying, the ones people use most first; media are the expensive ones and go apart
export const STUDY_FEATURES = [
  "QuestionGeneration",
  "AnswerGrading",
  "MistakeExplanation",
  "DictionaryGeneration",
  "SummaryGeneration",
  "EssayReview",
  "WordLookup",
  "WordExplanation",
] as const;

export const MEDIA_FEATURES = ["PodcastGeneration", "VideoTranscript"] as const;

export const quotaOf = (plan: IBillingPlan | undefined, feature: string) => plan?.aiPerMonth[feature] ?? 0;

// A plan without a yearly price is shown with its monthly one; Free has none
export const priceFor = (plan: IBillingPlan, interval: BillingIntervalName): IBillingPrice | undefined =>
  plan.prices.find((price) => price.interval === interval) ?? plan.prices[0];

// How many times a quota is Free's; null when it isn't clearly more
export const timesFree = (value: number, free: number) => (free > 0 && value >= free * 2 ? Math.round(value / free) : null);

// The usual multiplier of study AI over Free: the middle one, so one odd quota doesn't decide it
export const studyTimes = (plan: IBillingPlan, free: IBillingPlan | undefined) => {
  if (!free) return null;
  const times = STUDY_FEATURES.map((feature) => timesFree(quotaOf(plan, feature), quotaOf(free, feature)))
    .filter((value): value is number => value !== null)
    .sort((a, b) => a - b);
  return times.length > 0 ? times[Math.floor(times.length / 2)] : null;
};

// How much cheaper Duo is than two Plus for the same period, in whole percent
export const duoSaving = (plus: IBillingPrice | undefined, duo: IBillingPrice | undefined, currency: string) => {
  if (!plus || !duo || plus.interval !== duo.interval) return null;
  const one = priceIn(plus, currency);
  const two = priceIn(duo, currency);
  if (one.currency !== two.currency) return null;

  const saving = Math.round((1 - two.amount / (one.amount * 2)) * 100);
  return saving > 0 ? saving : null;
};
