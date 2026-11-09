import { isAxiosError } from "axios";
import type { TFunction } from "i18next";

// Server answers 409 when a limit is reached or something already exists (one summary per material)
export const getLimitErrorMessage = (error: unknown, t: TFunction): string | null => {
  if (!isAxiosError(error) || error.response?.status !== 409) return null;

  return t("limits.reachedToast");
};
