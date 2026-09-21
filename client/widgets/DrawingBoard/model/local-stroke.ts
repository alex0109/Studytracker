import { Point } from "./point";
import { ITool } from "./tool";

export type ILocalStroke = {
  points: Point[];
  color: string;
  size: number;
  tool: ITool;
};
