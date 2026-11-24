import { isAxiosError } from "axios";
import { IAiDenial } from "../model";

// The global upsell already told the user; the feature shouldn't toast the same again
const HANDLED = Symbol.for("studytracker.aiDenialHandled");

export const aiDenialOf = (error: unknown): IAiDenial | null =>
  isAxiosError(error) && error.response?.status === 402 && typeof error.response.data?.code === "string"
    ? (error.response.data as IAiDenial)
    : null;

export const markAiDenialHandled = (error: unknown) => {
  if (error && typeof error === "object") (error as Record<symbol, boolean>)[HANDLED] = true;
};

export const isAiDenialHandled = (error: unknown) =>
  !!error && typeof error === "object" && (error as Record<symbol, boolean>)[HANDLED] === true;
