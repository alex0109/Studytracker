import { FC, useMemo } from "react";
import { IDrawingContent } from "../../model";
import { strokeFill, strokePath, strokeStyle } from "../../lib/stroke-path";

interface DrawingViewerProps {
  content: IDrawingContent;
  title: string;
}

// A drawing note as a picture: on white paper in both themes, as it was drawn
export const DrawingViewer: FC<DrawingViewerProps> = ({ content, title }) => {
  const width = content.width || 1000;
  const height = content.height || 1000;

  const paths = useMemo(
    () =>
      content.strokes
        .map((stroke) => ({
          id: stroke.id,
          fill: strokeFill(stroke),
          style: strokeStyle(stroke.tool),
          d: strokePath(stroke, width, height),
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
        <path key={stroke.id ?? index} d={stroke.d!} fill={stroke.fill} style={stroke.style} />
      ))}
    </svg>
  );
};
