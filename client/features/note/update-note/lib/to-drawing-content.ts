import { IDrawingContent } from "@/entities/note/model";
import { ILocalStroke } from "../model/local-stroke";

export function toDrawingContent(
  strokes: ILocalStroke[],
  canvasSize: { width: number; height: number },
): IDrawingContent {
  return {
    version: 1,
    strokes: strokes.map((s) => ({ ...s, id: crypto.randomUUID() })),
    width: canvasSize.width,
    height: canvasSize.height,
  };
}
