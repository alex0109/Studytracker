export interface IQuestionCreateForm {
  title: string;
  questionDifficulty: string;
  // Open question
  answer: string;
  // Options question
  options: { name: string }[];
  correctOptionIndex: number;
  // True/False question
  isTrue: boolean;
}
