import { IStroke } from "./stroke.type";

export interface IDrawingContent {
  version: 1;
  strokes: IStroke[];
  width: number;
  height: number;
}
