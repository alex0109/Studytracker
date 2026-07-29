import { QuestionDifficultyEnum } from "@/entities/question/model/question-difficulty";

export interface IDifficultyStat {
  difficulty: QuestionDifficultyEnum;
  answersCount: number;
  accuracy: number;
  averageTimeSpent: number;
}
