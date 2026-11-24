import { isAxiosError } from "axios";
import type { TFunction } from "i18next";
import { aiDenialOf, isAiDenialHandled } from "./ai-denial";

const MESSAGES = {
  400: "ai.errors.badRequest",
  409: "ai.errors.limit",
  422: "ai.errors.nothing",
  503: "ai.errors.unavailable",
} as const;

const DENIALS = {
  quota_exhausted: "ai.errors.quota",
  insufficient_credits: "ai.errors.credits",
  trial_used: "ai.errors.trialUsed",
  input_too_large: "ai.errors.inputTooLarge",
} as const;

// Expected AI answers: quota, credits, all providers down, nothing generated, bad source. Null: an
// unknown error to report; "": the upsell window already explained it, nothing more to show
export const getAiErrorMessage = (error: unknown, t: TFunction): string | null => {
  if (!isAxiosError(error)) return null;
  if (isAiDenialHandled(error)) return "";

  const denial = aiDenialOf(error);
  if (denial) return t(DENIALS[denial.code] ?? DENIALS.quota_exhausted, { max: denial.maxInputChars?.toLocaleString() });

  const status = error.response?.status;
  if (!status || !(status in MESSAGES)) return null;

  return t(MESSAGES[status as keyof typeof MESSAGES]);
};
