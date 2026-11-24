import { IConfidenceLevel } from "@/entities/attempt/@x/statistics";

export interface IConfidenceCalibration {
  confidenceLevel: IConfidenceLevel;
  answersCount: number;
  actualAccuracy: number;
  calibrationGap: number;
}
