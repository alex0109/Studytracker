import { isAxiosError } from "axios";
import type { TFunction } from "i18next";

const MESSAGES = {
  400: "ai.errors.badRequest",
  409: "ai.errors.limit",
  422: "ai.errors.nothing",
  429: "ai.errors.quota",
  503: "ai.errors.unavailable",
} as const;

// Expected AI answers: quota, all providers down, nothing generated, bad source.
// Null means an unknown error that should be reported
export const getAiErrorMessage = (error: unknown, t: TFunction): string | null => {
  if (!isAxiosError(error)) return null;

  const status = error.response?.status;
  if (!status || !(status in MESSAGES)) return null;

  return t(MESSAGES[status as keyof typeof MESSAGES]);
};
