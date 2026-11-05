export interface IAssessment {
  id: string;
  materialId: string;
  // Time limit for an attempt on the whole material, null when there is none
  timerMinutes?: number | null;
}
