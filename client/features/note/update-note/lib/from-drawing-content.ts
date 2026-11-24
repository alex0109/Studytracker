import { IDrawingContent } from "@/entities/note";
import { ILocalStroke } from "../model/local-stroke";

export function fromDrawingContent(content: IDrawingContent): ILocalStroke[] {
  return content.strokes.map((s) => ({
    points: s.points,
    color: s.color,
    size: s.size,
    tool: s.tool,
  }));
}
