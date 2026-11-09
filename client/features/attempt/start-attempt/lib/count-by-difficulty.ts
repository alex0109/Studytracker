import { EXAM_DIFFICULTIES, ExamDifficulty } from "@/entities/assessment";
import { IQuestionResponse } from "@/entities/question";

export type DifficultyCounts = Record<ExamDifficulty, number>;

// Only active questions get into an attempt. The level is compared without case:
// the server writes "Easy", older code on the client "easy"
export const countByDifficulty = (questions: IQuestionResponse[]): DifficultyCounts => {
  const counts = Object.fromEntries(EXAM_DIFFICULTIES.map((level) => [level, 0])) as DifficultyCounts;

  for (const question of questions) {
    if (!question.isActive) continue;

    const level = EXAM_DIFFICULTIES.find(
      (item) => item.toLowerCase() === String(question.questionDifficulty).toLowerCase(),
    );
    if (level) counts[level] += 1;
  }

  return counts;
};

export const sumOf = (counts: DifficultyCounts, levels: readonly ExamDifficulty[]) =>
  levels.reduce((sum, level) => sum + counts[level], 0);
