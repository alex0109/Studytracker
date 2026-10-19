import { QuestionDifficultyEnum } from "@/entities/question/model/question-difficulty";
import { IConfidenceLevel } from "@/entities/attempt/model/confidence-level";

export const COLORS = {
  emerald: "#10b981", // emerald-500
  rose: "#f43f5e", // rose-500
  line: "#d4d4d4", // neutral-300
  tick: "#737373", // neutral-500
  grid: "#262626", // neutral-800
} as const;

export function accuracyTone(value: number) {
  if (value >= 75)
    return {
      hex: COLORS.emerald,
      text: "text-emerald-400",
      bar: "bg-emerald-500",
      badge: "bg-emerald-500/10 text-emerald-400",
      label: "Strong",
    };
  if (value >= 50)
    return {
      hex: COLORS.line,
      text: "text-neutral-300",
      bar: "bg-neutral-300",
      badge: "bg-neutral-800 text-neutral-300",
      label: "Fair",
    };
  return {
    hex: COLORS.rose,
    text: "text-rose-400",
    bar: "bg-rose-500",
    badge: "bg-rose-500/10 text-rose-400",
    label: "Weak",
  };
}

export function normalizeDifficulty(raw: unknown): QuestionDifficultyEnum {
  const key = String(raw).trim().toLowerCase();

  if (key === "1" || key === "easy") return QuestionDifficultyEnum.Easy;
  if (key === "2" || key === "medium") return QuestionDifficultyEnum.Medium;
  if (key === "3" || key === "hard") return QuestionDifficultyEnum.Hard;

  return QuestionDifficultyEnum.Easy;
}

export const difficultyLabel: Record<QuestionDifficultyEnum, string> = {
  [QuestionDifficultyEnum.Easy]: "Easy",
  [QuestionDifficultyEnum.Medium]: "Medium",
  [QuestionDifficultyEnum.Hard]: "Hard",
};

export const confidenceLabel: Record<IConfidenceLevel, string> = {
  0: "Low",
  1: "Medium",
  2: "High",
} as Record<IConfidenceLevel, string>;

export function formatDuration(value: number | string): string {
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

  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return "0s";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.round(totalSeconds % 60);

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export const formatShortDate = (d: Date) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(
    d,
  );

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
