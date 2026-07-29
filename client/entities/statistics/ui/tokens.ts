import { QuestionDifficultyEnum } from "@/entities/question/model/question-difficulty";
import { IConfidenceLevel } from "@/entities/attempt/model/confidence-level";

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
  2: "Hard",
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
