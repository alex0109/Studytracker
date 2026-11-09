import { ExamDifficulty } from "@/entities/assessment";

// Translation keys of the level names
export const DIFFICULTY_LABEL_KEYS = {
  Easy: "questions.difficulty.easy",
  Medium: "questions.difficulty.medium",
  Hard: "questions.difficulty.hard",
} as const satisfies Record<ExamDifficulty, string>;
