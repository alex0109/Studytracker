import React, { FC, RefObject } from "react";
import { Point, Stroke } from "../../model";

interface CanvasProps {
  svgRef: RefObject<SVGSVGElement | null>;
  strokes: Stroke[];
  currentStroke: Point[];
  handlePointerDown: (e: React.PointerEvent<SVGSVGElement>) => void;
  handlePointerMove: (e: React.PointerEvent<SVGSVGElement>) => void;
  handlePointerUp: (e: React.PointerEvent<SVGSVGElement>) => void;
  handlePointerCancel: (e: React.PointerEvent<SVGSVGElement>) => void;
  renderStroke: (points: Point[]) => string | null;
}

export const Canvas: FC<CanvasProps> = ({
  svgRef,
  strokes,
  currentStroke,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  handlePointerCancel,
  renderStroke,
}) => {
  return (
    <div className="flex-1 min-h-0 border border-neutral-200 rounded-xl overflow-hidden">
      <svg
        ref={svgRef}
        className="w-full h-full touch-none select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        {strokes.map((stroke, index) => {
          const path = renderStroke(stroke.points);

          if (!path) {
            return null;
          }

          return <path key={index} d={path} fill="black" />;
        })}

        {currentStroke.length > 0 && (
          <path d={renderStroke(currentStroke) ?? ""} fill="black" />
        )}
      </svg>
    </div>
  );
};
