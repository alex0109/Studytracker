import { IConfidenceLevel } from "@/entities/attempt/model/confidence-level";

export interface IConfidenceCalibration {
  confidenceLevel: IConfidenceLevel;
  answersCount: number;
  actualAccuracy: number;
  calibrationGap: number;
}
