// The question levels as the server names them
export type ExamDifficulty = "Easy" | "Medium" | "Hard";

export const EXAM_DIFFICULTIES: readonly ExamDifficulty[] = ["Easy", "Medium", "Hard"];

export interface IAssessment {
  id: string;
  materialId: string;
  // Time limit for an attempt on the whole material, null when there is none
  timerMinutes?: number | null;
  // Levels an attempt on the whole material draws from, every level when none was chosen
  difficulties: ExamDifficulty[];
  // How many questions such an attempt takes, null for every one that matches
  questionCount: number | null;
}

export type IAssessmentSettings = Pick<IAssessment, "difficulties" | "questionCount"> & {
  timerMinutes: number | null;
};
