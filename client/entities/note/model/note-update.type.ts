import { IDrawingContent } from "./drawing-content.type";

export interface INoteUpdate {
  title?: string;
  textContent?: string;
  drawingContent?: IDrawingContent;
  order?: number;
}
