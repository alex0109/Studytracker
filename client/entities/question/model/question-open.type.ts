export interface IOpenQuestionRequest {
  materialId: string;
  title: string;
  answer: string;
  explanation?: string;
  questionDifficulty: string;
}
