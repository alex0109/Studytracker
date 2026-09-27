import React, { FC, useEffect, useRef, useState } from "react";
import { getStroke } from "perfect-freehand";
import { Toolbar } from "./toolbar";
import { Canvas } from "./canvas";
import { Point, ILocalStroke, ITool } from "../../model";
import { DEFAULT_COLOR, DEFAULT_SIZE, DEFAULT_TOOL } from "../../consts";
import { toDrawingContent } from "../../lib/to-drawing-content";
import { fromDrawingContent } from "../../lib/from-drawing-content";
import { IDrawingContent } from "@/entities/note/model";
import { useDebounce } from "@/shared/hooks";

interface CanvasSize {
  width: number;
  height: number;
}

interface DrawingBoardProps {
  materialId: string;
  noteId: string;
  initialContent?: IDrawingContent;
  updateContentHandler: (
    materialId: string,
    content: IDrawingContent,
    noteId?: string,
  ) => void;
}

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

export const DrawingBoard: FC<DrawingBoardProps> = ({
  materialId,
  noteId,
  initialContent,
  updateContentHandler,
}) => {
  const [strokes, setStrokes] = useState<ILocalStroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const [color, setColor] = useState(DEFAULT_COLOR);
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [tool, setTool] = useState<ITool>(DEFAULT_TOOL);

  const [canvasSize, setCanvasSize] = useState<CanvasSize>({
    width: 0,
    height: 0,
  });

  const svgRef = useRef<SVGSVGElement | null>(null);
  const isHydrated = useRef(false);
  const hasUserEdited = useRef(false);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const updateSize = () => {
      const rect = svg.getBoundingClientRect();
      setCanvasSize({ width: rect.width, height: rect.height });
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (initialContent && !isHydrated.current) {
      setStrokes(fromDrawingContent(initialContent));
    }
    isHydrated.current = true;
    hasUserEdited.current = false;
  }, [noteId]);

  const debouncedStrokes = useDebounce(strokes, 800);

  useEffect(() => {
    if (!isHydrated.current || !hasUserEdited.current) return;

    const drawingContent = toDrawingContent(debouncedStrokes, canvasSize);
    updateContentHandler(materialId, drawingContent, noteId);
  }, [debouncedStrokes]);

  function getSvgPath(points: number[][]) {
    if (!points.length) return "";
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
    if (!svg) return [0, 0, e.pressure || 0.5];

    const rect = svg.getBoundingClientRect();
    const x = rect.width ? (e.clientX - rect.left) / rect.width : 0;
    const y = rect.height ? (e.clientY - rect.top) / rect.height : 0;

    return [clamp01(x), clamp01(y), e.pressure || 0.5];
  }

  function handlePointerDown(e: React.PointerEvent<SVGSVGElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDrawing(true);
    setCurrentStroke([getPointerPosition(e)]);
  }

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!isDrawing) return;
    setCurrentStroke((prev) => [...prev, getPointerPosition(e)]);
  }

  function handlePointerUp(e: React.PointerEvent<SVGSVGElement>) {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    setIsDrawing(false);

    if (currentStroke.length > 0) {
      const rect = svgRef.current?.getBoundingClientRect();
      const normalizedSize = rect?.width ? size / rect.width : size;

      hasUserEdited.current = true;
      setStrokes((prev) => [
        ...prev,
        { points: currentStroke, color, size: normalizedSize, tool },
      ]);
    }

    setCurrentStroke([]);
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
      if (prev.length === 0) return prev;
      hasUserEdited.current = true;
      return prev.slice(0, -1);
    });
  }

  function handleClear() {
    if (strokes.length > 0 || currentStroke.length > 0) {
      hasUserEdited.current = true;
    }
    setStrokes([]);
    setCurrentStroke([]);
  }

  function renderStroke(stroke: ILocalStroke, size: CanvasSize): string | null {
    if (stroke.points.length === 0 || !size.width || !size.height) {
      return null;
    }

    const pixelPoints = stroke.points.map(
      ([x, y, pressure]) =>
        [x * size.width, y * size.height, pressure] as Point,
    );

    const outline = getStroke(pixelPoints, {
      size: stroke.size * size.width,
      thinning: 0.5,
      smoothing: 0.5,
      streamline: 0.5,
      easing: (t) => t,
      start: { cap: true },
      end: { cap: true },
    });

    return getSvgPath(outline);
  }

  const normalizedBrushSize = canvasSize.width ? size / canvasSize.width : size;

  return (
    <div className="flex flex-3 flex-col gap-3 bg-transparent h-[1000px] rounded-2xl p-5">
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
        currentTool={{ color, size: normalizedBrushSize, tool }}
        canvasSize={canvasSize}
        handlePointerDown={handlePointerDown}
        handlePointerMove={handlePointerMove}
        handlePointerUp={handlePointerUp}
        handlePointerCancel={handlePointerCancel}
        renderStroke={renderStroke}
      />
    </div>
  );
};
