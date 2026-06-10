export interface IQuestion {
  id: string;
  materialId: string;
  title: string;
  answer: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuestionReduced {
  id: string;
  title: string;
}
