import { getStroke } from "perfect-freehand";
import { IStroke } from "../model/stroke.type";

type StrokeLike = Pick<IStroke, "points" | "size" | "tool">;

// Drawings are on white paper in both themes, so the eraser is simply paint in the paper's colour:
// it also works on old strokes, which were saved in whatever colour was selected
const PAPER_COLOR = "#ffffff";

export const strokeFill = (stroke: Pick<IStroke, "tool" | "color">) =>
  stroke.tool === "eraser" ? PAPER_COLOR : stroke.color;

// A marker lets what is under it show through
export const strokeStyle = (tool: IStroke["tool"]) =>
  tool === "highlighter" ? ({ fillOpacity: 0.4, mixBlendMode: "multiply" } as const) : undefined;

const average = (a: number, b: number) => (a + b) / 2;

// The outline as curves through the midpoints, not straight segments: edges stay smooth when scaled
const outlineToPath = (outline: number[][]) => {
  if (outline.length < 2) return null;

  const first = outline[0];
  const curves = outline.map((point, index) => {
    const next = outline[(index + 1) % outline.length];
    return `Q${point[0].toFixed(2)},${point[1].toFixed(2)} ${average(point[0], next[0]).toFixed(2)},${average(point[1], next[1]).toFixed(2)}`;
  });

  return `M${first[0].toFixed(2)},${first[1].toFixed(2)} ${curves.join(" ")} Z`;
};

// Points are stored as 0..1 of the paper and the size as a share of its width, so a drawing looks
// the same at any size. A mouse reports one fixed pressure: then the width follows the speed instead
export const strokePath = (stroke: StrokeLike, width: number, height: number, isFinished = true) => {
  if (stroke.points.length === 0) return null;

  const isMarker = stroke.tool !== "pen";
  const outline = getStroke(
    stroke.points.map(([x, y, pressure]) => [x * width, y * height, pressure]),
    {
      size: stroke.size * width,
      thinning: isMarker ? 0 : 0.5,
      smoothing: 0.5,
      streamline: 0.5,
      simulatePressure: !isMarker && stroke.points.every(([, , pressure]) => pressure === 0.5),
      start: { cap: true },
      end: { cap: true },
      last: isFinished,
    },
  );

  return outlineToPath(outline);
};
