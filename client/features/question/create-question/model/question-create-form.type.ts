export interface IQuestionCreateForm {
  title: string;
  questionDifficulty: string;
  // Open question
  answer: string;
  // Options question, at least one option is correct
  options: { name: string; isCorrect: boolean }[];
  // True/False question
  isTrue: boolean;
}
