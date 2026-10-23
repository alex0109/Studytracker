import { isAxiosError } from "axios";

// Unknown limit (still loading) never blocks, the server checks it anyway
export const isLimitReached = (used?: number, max?: number): boolean =>
  used !== undefined && max !== undefined && used >= max;

// Server answers 409 with ProblemDetails when a limit is reached
export const getLimitErrorMessage = (error: unknown): string | null => {
  if (!isAxiosError(error) || error.response?.status !== 409) return null;

  const detail = error.response.data?.detail;

  return typeof detail === "string" && detail ? detail : "Limit reached";
};
