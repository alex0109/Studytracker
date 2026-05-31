import { IAssessment } from "./assessment.type";

export type TUpdateAssessment = Partial<IAssessment> & {
  id: string;
  materialId: string;
};
