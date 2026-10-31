import { FC, useMemo } from "react";
import { getStroke } from "perfect-freehand";
import { IDrawingContent } from "../../model";

interface DrawingViewerProps {
  content: IDrawingContent;
  title: string;
}

// Same outline as the drawing board draws, from points stored as 0..1 of the canvas
const strokePath = (
  points: [number, number, number][],
  size: number,
  width: number,
  height: number,
) => {
  const outline = getStroke(
    points.map(([x, y, pressure]) => [x * width, y * height, pressure]),
    {
      size: size * width,
      thinning: 0.5,
      smoothing: 0.5,
      streamline: 0.5,
      easing: (t) => t,
      start: { cap: true },
      end: { cap: true },
    },
  );
  if (!outline.length) return null;

  const [first, ...rest] = outline;
  return `M ${first[0]} ${first[1]} ${rest.map(([x, y]) => `L ${x} ${y}`).join(" ")} Z`;
};

// A drawing note as a picture: on white paper in both themes, as it was drawn
export const DrawingViewer: FC<DrawingViewerProps> = ({ content, title }) => {
  const width = content.width || 1000;
  const height = content.height || 1000;

  const paths = useMemo(
    () =>
      content.strokes
        .map((stroke) => ({
          id: stroke.id,
          color: stroke.color,
          d: strokePath(stroke.points, stroke.size, width, height),
        }))
        .filter((stroke) => stroke.d !== null),
    [content.strokes, width, height],
  );

  return (
    <svg
      role="img"
      aria-label={title}
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full rounded-xl border border-neutral-200 bg-white dark:border-neutral-700"
    >
      {paths.map((stroke, index) => (
        <path key={stroke.id ?? index} d={stroke.d!} fill={stroke.color} />
      ))}
    </svg>
  );
};
