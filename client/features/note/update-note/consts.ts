import { ITool } from "./model/tool";

export const DEFAULT_TOOL: ITool = "pen";

// New drawings are this size in their own units: 4:3, and the same at any screen width
export const PAPER = { width: 1200, height: 900 };

export const PEN_COLORS = ["#171717", "#ef4444", "#2563eb", "#16a34a", "#f59e0b", "#7c3aed"];
export const MARKER_COLORS = ["#fde047", "#86efac", "#f9a8d4", "#7dd3fc"];

// In paper units, from a fine line to a wide stroke
export const BRUSH_SIZES = [3, 6, 10, 18, 32];
export const DEFAULT_SIZES: Record<ITool, number> = { pen: 6, highlighter: 18, eraser: 18 };
