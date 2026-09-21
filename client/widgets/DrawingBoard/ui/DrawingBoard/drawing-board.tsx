import React, { FC, useRef, useState } from "react";
import { getStroke } from "perfect-freehand";
import { Toolbar } from "../Toolbar/toolbar";
import { Canvas } from "../Canvas/canvas";
import { Point, ILocalStroke, ITool } from "../../model";
import { DEFAULT_COLOR, DEFAULT_SIZE, DEFAULT_TOOL } from "../../consts";
import { toDrawingContent } from "../../lib/to-drawing-content";

export const DrawingBoard: FC = () => {
  const [strokes, setStrokes] = useState<ILocalStroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const [color, setColor] = useState(DEFAULT_COLOR);
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [tool, setTool] = useState<ITool>(DEFAULT_TOOL);

  const svgRef = useRef<SVGSVGElement | null>(null);

  //   useEffect(() => {
  //   if (note.drawingContent) {
  //     const localStrokes = fromDrawingContent(note.drawingContent);
  //     setStrokes(localStrokes);
  //   }
  // }, [note]);

  function getSvgPath(points: number[][]) {
    if (!points.length) {
      return "";
    }

    const first = points[0];

    let path = `M ${first[0]} ${first[1]}`;

    for (let i = 1; i < points.length; i++) {
      const point = points[i];

      path += ` L ${point[0]} ${point[1]}`;
    }

    path += " Z";

    return path;
  }

  function getPointerPosition(e: React.PointerEvent<SVGSVGElement>): Point {
    const svg = svgRef.current;

    if (!svg) {
      return [e.clientX, e.clientY, e.pressure || 0.5];
    }

    const rect = svg.getBoundingClientRect();

    return [e.clientX - rect.left, e.clientY - rect.top, e.pressure || 0.5];
  }

  function handlePointerDown(e: React.PointerEvent<SVGSVGElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);

    const point = getPointerPosition(e);

    setIsDrawing(true);
    setCurrentStroke([point]);
  }

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!isDrawing) {
      return;
    }

    const point = getPointerPosition(e);

    setCurrentStroke((prev) => [...prev, point]);
  }

  function handlePointerUp(e: React.PointerEvent<SVGSVGElement>) {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    setIsDrawing(false);

    setCurrentStroke((current) => {
      if (current.length > 0) {
        setStrokes((prev) => [
          ...prev,
          {
            points: current,
            color,
            size,
            tool,
          },
        ]);
      }

      return [];
    });
  }

  function handlePointerCancel(e: React.PointerEvent<SVGSVGElement>) {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    setIsDrawing(false);
    setCurrentStroke([]);
  }

  function handleUndo() {
    setStrokes((prev) => {
      if (prev.length === 0) {
        return prev;
      }

      return prev.slice(0, -1);
    });
  }

  function handleClear() {
    setStrokes([]);
    setCurrentStroke([]);
  }

  function renderStroke(stroke: ILocalStroke) {
    if (stroke.points.length === 0) {
      return null;
    }

    const outline = getStroke(stroke.points, {
      size: stroke.size,
      thinning: 0.5,
      smoothing: 0.5,
      streamline: 0.5,

      easing: (t) => t,

      start: {
        cap: true,
      },

      end: {
        cap: true,
      },
    });

    const path = getSvgPath(outline);

    if (!path) {
      return null;
    }

    return path;
  }

  function handleSave() {
    const svg = svgRef.current;
    const canvasSize = {
      width: svg?.clientWidth ?? 0,
      height: svg?.clientHeight ?? 0,
    };

    const drawingContent = toDrawingContent(strokes, canvasSize);
  }

  return (
    <div className="flex flex-3 flex-col gap-3 bg-transparent h-[500px] rounded-2xl p-5">
      <Toolbar
        strokes={strokes}
        currentStroke={currentStroke}
        handleClear={handleClear}
        handleUndo={handleUndo}
        color={color}
        size={size}
        tool={tool}
        onColorChange={setColor}
        onSizeChange={setSize}
        onToolChange={setTool}
      />
      <Canvas
        svgRef={svgRef}
        strokes={strokes}
        currentStroke={currentStroke}
        currentTool={{ color, size, tool }}
        handlePointerDown={handlePointerDown}
        handlePointerMove={handlePointerMove}
        handlePointerUp={handlePointerUp}
        handlePointerCancel={handlePointerCancel}
        renderStroke={renderStroke}
      />
    </div>
  );
};
