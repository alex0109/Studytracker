import { isAxiosError } from "axios";
import type { TFunction } from "i18next";

// Server reasons in the user's language; null means unexpected (worth reporting)
export const getLibraryRequestError = (error: unknown, t: TFunction): string | null => {
  if (!isAxiosError(error)) return null;

  const status = error.response?.status;
  const data = error.response?.data as { title?: string; detail?: string } | undefined;
  const detail = data?.detail ?? "";

  if (status === 409) {
    return data?.title === "Limit exceeded"
      ? t("library.errors.tooManyPending")
      : t("library.errors.alreadyPending");
  }

  if (status === 400) {
    if (detail.includes("too large")) return t("library.errors.tooLarge");
    if (detail.includes("imported from the library")) return t("library.errors.fromLibrary");
    if (detail.includes("Nickname")) return t("library.errors.nickname");
    return t("library.errors.generic");
  }

  if (status === 404) return t("library.errors.notFound");

  return null;
};
