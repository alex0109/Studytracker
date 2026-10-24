import { isAxiosError } from "axios";

const fallbackMessages: Record<number, string> = {
  400: "Can't generate from this content",
  409: "Limit reached",
  422: "AI could not generate anything for this content",
  429: "AI limit for this month is reached",
  503: "AI is not responding right now, please try again later",
};

// Expected AI answers: quota, all providers down, nothing generated, bad source.
// Null means an unknown error that should be reported
export const getAiErrorMessage = (error: unknown): string | null => {
  if (!isAxiosError(error)) return null;

  const status = error.response?.status;
  if (!status || !(status in fallbackMessages)) return null;

  const detail = error.response?.data?.detail;

  return typeof detail === "string" && detail
    ? detail
    : fallbackMessages[status];
};
