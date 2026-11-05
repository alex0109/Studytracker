import React, { FC, useEffect, useReducer, useRef, useState } from "react";
import { Toolbar } from "./toolbar";
import { Canvas } from "./canvas";
import { Point, ILocalStroke, ITool } from "../../model";
import { DEFAULT_SIZES, DEFAULT_TOOL, MARKER_COLORS, PAPER, PEN_COLORS } from "../../consts";
import { toDrawingContent } from "../../lib/to-drawing-content";
import { fromDrawingContent } from "../../lib/from-drawing-content";
import { IDrawingContent } from "@/entities/note/model";
import { useLatest } from "@/shared/hooks";

const SAVE_DELAY_MS = 800;
const MAX_HISTORY = 100;

interface DrawingBoardProps {
  materialId: string;
  noteId: string;
  initialContent?: IDrawingContent;
  updateContentHandler: (materialId: string, content: IDrawingContent, noteId?: string) => void;
  isSaving: boolean;
  isSaveError: boolean;
}

interface History {
  past: ILocalStroke[][];
  present: ILocalStroke[];
  future: ILocalStroke[][];
}

type HistoryAction =
  | { type: "add"; stroke: ILocalStroke }
  | { type: "clear" }
  | { type: "undo" }
  | { type: "redo" };

const historyReducer = (state: History, action: HistoryAction): History => {
  const remember = () => [...state.past, state.present].slice(-MAX_HISTORY);

  switch (action.type) {
    case "add":
      return { past: remember(), present: [...state.present, action.stroke], future: [] };
    case "clear":
      return state.present.length ? { past: remember(), present: [], future: [] } : state;
    case "undo":
      return state.past.length
        ? {
            past: state.past.slice(0, -1),
            present: state.past[state.past.length - 1],
            future: [state.present, ...state.future],
          }
        : state;
    case "redo":
      return state.future.length
        ? { past: remember(), present: state.future[0], future: state.future.slice(1) }
        : state;
  }
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const DrawingBoard: FC<DrawingBoardProps> = ({
  materialId,
  noteId,
  initialContent,
  updateContentHandler,
  isSaving,
  isSaveError,
}) => {
  // A saved drawing keeps its own proportions; stretching it to the screen would distort it
  const [paper] = useState(() =>
    initialContent?.width && initialContent?.height
      ? { width: initialContent.width, height: initialContent.height }
      : PAPER,
  );
  const [history, dispatch] = useReducer(historyReducer, initialContent, (content): History => ({
    past: [],
    present: content ? fromDrawingContent(content) : [],
    future: [],
  }));
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);

  const [tool, setTool] = useState<ITool>(DEFAULT_TOOL);
  const [colors, setColors] = useState({ pen: PEN_COLORS[0], highlighter: MARKER_COLORS[0] });
  const [sizes, setSizes] = useState(DEFAULT_SIZES);

  const color = tool === "highlighter" ? colors.highlighter : colors.pen;
  const size = sizes[tool];

  const svgRef = useRef<SVGSVGElement | null>(null);
  // The finger or pen that is drawing right now: a palm or a second finger doesn't add to its line
  const activePointer = useRef<number | null>(null);
  const penSeen = useRef(false);

  // Autosave after a pause. A note opened right after drawing still saves the last strokes
  const latest = useLatest({ materialId, noteId, paper, strokes: history.present, updateContentHandler });
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  const save = () => {
    saveTimer.current = null;
    const { materialId, noteId, paper, strokes, updateContentHandler } = latest.current;
    updateContentHandler(materialId, toDrawingContent(strokes, paper), noteId);
  };
  const latestSave = useLatest(save);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => latestSave.current(), SAVE_DELAY_MS);
  }, [history.present, latestSave]);

  useEffect(
    () => () => {
      if (!saveTimer.current) return;
      clearTimeout(saveTimer.current);
      latestSave.current();
    },
    [latestSave],
  );

  // Works anywhere on the page, except while typing in a field
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;

      const key = event.key.toLowerCase();
      if ((event.metaKey || event.ctrlKey) && key === "z") {
        event.preventDefault();
        dispatch({ type: event.shiftKey ? "redo" : "undo" });
      } else if (!event.metaKey && !event.ctrlKey) {
        const shortcuts: Record<string, ITool> = { p: "pen", h: "highlighter", e: "eraser" };
        if (shortcuts[key]) setTool(shortcuts[key]);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const toPaperPoint = (event: { clientX: number; clientY: number; pressure: number }): Point | null => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!matrix) return null;

    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    return [clamp01(point.x / paper.width), clamp01(point.y / paper.height), event.pressure || 0.5];
  };

  const handlePointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    // On a tablet the pen draws and the resting hand doesn't
    if (event.pointerType === "pen") penSeen.current = true;
    if (event.pointerType === "touch" && penSeen.current) return;
    if (event.button !== 0 || activePointer.current !== null) return;

    const point = toPaperPoint(event);
    if (!point) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    activePointer.current = event.pointerId;
    setCurrentStroke([point]);
  };

  const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (event.pointerId !== activePointer.current) return;

    // Between two frames a fast hand gives several positions: without them curves turn into corners
    const events = event.nativeEvent.getCoalescedEvents?.() ?? [];
    const points = (events.length ? events : [event.nativeEvent])
      .map(toPaperPoint)
      .filter((point): point is Point => point !== null);

    setCurrentStroke((prev) => [...prev, ...points]);
  };

  const finishStroke = (event: React.PointerEvent<SVGSVGElement>, keep: boolean) => {
    if (event.pointerId !== activePointer.current) return;
    activePointer.current = null;

    if (keep && currentStroke.length > 0) {
      dispatch({
        type: "add",
        stroke: { points: currentStroke, color, size: size / paper.width, tool },
      });
    }
    setCurrentStroke([]);
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-3 p-2 sm:p-4">
      <Toolbar
        tool={tool}
        color={color}
        size={size}
        canUndo={history.past.length > 0}
        canRedo={history.future.length > 0}
        canClear={history.present.length > 0}
        isSaving={isSaving}
        isSaveError={isSaveError}
        onToolChange={setTool}
        onColorChange={(next) => setColors((prev) => ({ ...prev, [tool === "highlighter" ? "highlighter" : "pen"]: next }))}
        onSizeChange={(next) => setSizes((prev) => ({ ...prev, [tool]: next }))}
        onUndo={() => dispatch({ type: "undo" })}
        onRedo={() => dispatch({ type: "redo" })}
        onClear={() => dispatch({ type: "clear" })}
      />
      <Canvas
        svgRef={svgRef}
        paper={paper}
        strokes={history.present}
        currentStroke={currentStroke}
        currentTool={{ color, size: size / paper.width, tool }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(event) => finishStroke(event, true)}
        onPointerCancel={(event) => finishStroke(event, false)}
      />
    </div>
  );
};
