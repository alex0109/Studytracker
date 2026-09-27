import React, { FC, RefObject } from "react";
import { ILocalStroke, ITool, Point } from "../../model";

interface CanvasSize {
  width: number;
  height: number;
}

interface CanvasProps {
  svgRef: RefObject<SVGSVGElement | null>;
  strokes: ILocalStroke[];
  currentStroke: Point[];
  currentTool: { color: string; size: number; tool: ITool };
  canvasSize: CanvasSize;
  handlePointerDown: (e: React.PointerEvent<SVGSVGElement>) => void;
  handlePointerMove: (e: React.PointerEvent<SVGSVGElement>) => void;
  handlePointerUp: (e: React.PointerEvent<SVGSVGElement>) => void;
  handlePointerCancel: (e: React.PointerEvent<SVGSVGElement>) => void;
  renderStroke: (stroke: ILocalStroke, canvasSize: CanvasSize) => string | null;
}

export const Canvas: FC<CanvasProps> = ({
  svgRef,
  strokes,
  currentStroke,
  currentTool,
  canvasSize,
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
          const path = renderStroke(stroke, canvasSize);
          if (!path) return null;
          return <path key={index} d={path} fill={stroke.color} />;
        })}

        {currentStroke.length > 0 &&
          (() => {
            const path = renderStroke(
              { points: currentStroke, ...currentTool },
              canvasSize,
            );
            if (!path) return null;
            return <path d={path} fill={currentTool.color} />;
          })()}
      </svg>
    </div>
  );
};
