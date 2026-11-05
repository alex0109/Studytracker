import React, { FC, memo, RefObject, useRef } from "react";
import { strokeFill, strokePath, strokeStyle } from "@/entities/note/lib/stroke-path";
import { useTranslation } from "@/shared/i18n";
import { ILocalStroke, ITool, Point } from "../../model";

interface CanvasProps {
  svgRef: RefObject<SVGSVGElement | null>;
  paper: { width: number; height: number };
  strokes: ILocalStroke[];
  currentStroke: Point[];
  currentTool: { color: string; size: number; tool: ITool };
  onPointerDown: (event: React.PointerEvent<SVGSVGElement>) => void;
  onPointerMove: (event: React.PointerEvent<SVGSVGElement>) => void;
  onPointerUp: (event: React.PointerEvent<SVGSVGElement>) => void;
  onPointerCancel: (event: React.PointerEvent<SVGSVGElement>) => void;
}

// Finished strokes don't change while the next one is drawn: without this every move of the pointer
// would recalculate the whole drawing
const FinishedStrokes = memo(function FinishedStrokes({
  strokes,
  paper,
}: Pick<CanvasProps, "strokes" | "paper">) {
  return strokes.map((stroke, index) => {
    const path = strokePath(stroke, paper.width, paper.height);
    return path ? <path key={index} d={path} fill={strokeFill(stroke)} style={strokeStyle(stroke.tool)} /> : null;
  });
});

export const Canvas: FC<CanvasProps> = ({
  svgRef,
  paper,
  strokes,
  currentStroke,
  currentTool,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
}) => {
  const { t } = useTranslation();
  const brushRef = useRef<HTMLDivElement>(null);

  const currentPath = strokePath(
    { points: currentStroke, size: currentTool.size, tool: currentTool.tool },
    paper.width,
    paper.height,
    false,
  );

  // The brush is drawn in place of the cursor, at its real size, by moving one element directly:
  // this runs on every pointer move and needs no render
  const moveBrush = (event: React.PointerEvent<SVGSVGElement>) => {
    const brush = brushRef.current;
    if (!brush) return;

    if (event.pointerType === "touch") {
      brush.style.opacity = "0";
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const diameter = Math.max(4, currentTool.size * rect.width);
    brush.style.opacity = "1";
    brush.style.width = `${diameter}px`;
    brush.style.height = `${diameter}px`;
    brush.style.transform = `translate(${event.clientX - rect.left - diameter / 2}px, ${event.clientY - rect.top - diameter / 2}px)`;
  };

  return (
    // White in both themes, like the paper the viewer shows it on: dark ink stays visible
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-700"
      style={{ aspectRatio: `${paper.width} / ${paper.height}` }}
    >
      {strokes.length === 0 && currentStroke.length === 0 && (
        <p className="pointer-events-none absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-neutral-400 select-none">
          {t("notes.drawing.hint")}
        </p>
      )}
      <svg
        ref={svgRef}
        role="img"
        aria-label={t("notes.drawing.canvas")}
        viewBox={`0 0 ${paper.width} ${paper.height}`}
        className="absolute inset-0 h-full w-full touch-none select-none [@media(hover:hover)]:cursor-none"
        onPointerDown={onPointerDown}
        onPointerMove={(event) => {
          moveBrush(event);
          onPointerMove(event);
        }}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onPointerLeave={() => {
          if (brushRef.current) brushRef.current.style.opacity = "0";
        }}
      >
        <FinishedStrokes strokes={strokes} paper={paper} />
        {currentPath && (
          <path d={currentPath} fill={strokeFill(currentTool)} style={strokeStyle(currentTool.tool)} />
        )}
      </svg>
      <div
        ref={brushRef}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 rounded-full border border-neutral-500/70 opacity-0"
        style={{ backgroundColor: currentTool.tool === "eraser" ? "#ffffff" : `${currentTool.color}66` }}
      />
    </div>
  );
};
