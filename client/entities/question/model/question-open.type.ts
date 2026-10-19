export interface IOpenQuestionRequest {
  materialId: string;
  noteId?: string;
  title: string;
  answer: string;
  explanation?: string;
  questionDifficulty: string;
}
