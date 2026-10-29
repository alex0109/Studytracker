import { QuestionDifficultyEnum } from "@/entities/question/model/question-difficulty";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/shared/theme";

export const COLORS = {
  emerald: "#10b981", // emerald-500
  rose: "#f43f5e", // rose-500
} as const;

// Neutral chart colours that follow the site theme
export function useChartColors() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return {
    line: dark ? "#d4d4d4" : "#737373", // neutral-300 / neutral-500
    tick: dark ? "#a3a3a3" : "#737373", // neutral-400 / neutral-500
    grid: dark ? "#262626" : "#e5e5e5", // neutral-800 / neutral-200
    label: dark ? "#fafafa" : "#171717", // neutral-50 / neutral-900
    reference: dark ? "#404040" : "#d4d4d4", // neutral-700 / neutral-300
    cursor: dark ? "#262626" : "#f5f5f5", // neutral-800 / neutral-100
  };
}

export type AccuracyLevel = "strong" | "fair" | "weak";

// Labels are translation keys under "statistics.levels"
export function accuracyTone(value: number) {
  if (value >= 75)
    return {
      level: "strong" as AccuracyLevel,
      hex: COLORS.emerald,
      text: "text-emerald-600 dark:text-emerald-400",
      bar: "bg-emerald-500",
      badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    };
  if (value >= 50)
    return {
      level: "fair" as AccuracyLevel,
      hex: "#a3a3a3", // neutral-400, readable in both themes
      text: "text-neutral-600 dark:text-neutral-300",
      bar: "bg-neutral-400 dark:bg-neutral-300",
      badge: "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
    };
  return {
    level: "weak" as AccuracyLevel,
    hex: COLORS.rose,
    text: "text-rose-600 dark:text-rose-400",
    bar: "bg-rose-500",
    badge: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
  };
}

export function normalizeDifficulty(raw: unknown): QuestionDifficultyEnum {
  const key = String(raw).trim().toLowerCase();

  if (key === "1" || key === "easy") return QuestionDifficultyEnum.Easy;
  if (key === "2" || key === "medium") return QuestionDifficultyEnum.Medium;
  if (key === "3" || key === "hard") return QuestionDifficultyEnum.Hard;

  return QuestionDifficultyEnum.Easy;
}

// Translation keys under "questions.difficulty"
export const difficultyKey = {
  [QuestionDifficultyEnum.Easy]: "easy",
  [QuestionDifficultyEnum.Medium]: "medium",
  [QuestionDifficultyEnum.Hard]: "hard",
} as const satisfies Record<QuestionDifficultyEnum, string>;

// Durations come as "hh:mm:ss" or seconds; units follow the site language
export function useFormatDuration() {
  const { t } = useTranslation();

  return (value: number | string) => {
    const { hours, minutes, seconds, empty } = splitDuration(value);

    if (empty) return t("statistics.duration.seconds", { seconds: 0 });
    if (hours > 0) return t("statistics.duration.hours", { hours, minutes });
    if (minutes > 0) return t("statistics.duration.minutes", { minutes, seconds });
    return t("statistics.duration.seconds", { seconds });
  };
}

function splitDuration(value: number | string) {
  let totalSeconds: number;

  if (typeof value === "string") {
    const parts = value.split(":").map(Number);
    totalSeconds =
      parts.length === 3
        ? parts[0] * 3600 + parts[1] * 60 + parts[2]
        : Number(value) || 0;
  } else {
    totalSeconds = value;
  }

  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0)
    return { hours: 0, minutes: 0, seconds: 0, empty: true };

  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: Math.round(totalSeconds % 60),
    empty: false,
  };
}

export const formatShortDate = (d: Date, language: string) =>
  new Intl.DateTimeFormat(language, { day: "numeric", month: "short" }).format(d);

export type ConfidenceName = "Low" | "Medium" | "High";

const CONFIDENCE_BY_KEY: Record<string, ConfidenceName> = {
  "0": "Low",
  low: "Low",
  "1": "Medium",
  medium: "Medium",
  "2": "High",
  high: "High",
};

const CONFIDENCE_RANK: Record<ConfidenceName, number> = {
  Low: 0,
  Medium: 1,
  High: 2,
};

export function normalizeConfidence(raw: unknown): ConfidenceName | null {
  return CONFIDENCE_BY_KEY[String(raw).trim().toLowerCase()] ?? null;
}

export const confidenceRank = (name: ConfidenceName) => CONFIDENCE_RANK[name];
