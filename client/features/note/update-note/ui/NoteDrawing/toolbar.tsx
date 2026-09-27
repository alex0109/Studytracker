import React, { FC } from "react";
import { Button } from "@/shared/radix-ui";
import {
  LuRotateCcw,
  LuTrash2,
  LuPen,
  LuEraser,
  LuHighlighter,
} from "react-icons/lu";
import { ILocalStroke } from "../../model/local-stroke";
import { Point } from "../../model/point";
import { ITool } from "../../model/tool";

interface ToolbarProps {
  strokes: ILocalStroke[];
  currentStroke: Point[];
  handleUndo: () => void;
  handleClear: () => void;

  color: string;
  size: number;
  tool: ITool;
  onColorChange: (color: string) => void;
  onSizeChange: (size: number) => void;
  onToolChange: (tool: ITool) => void;
}

const TOOLS: { value: ITool; icon: typeof LuPen }[] = [
  { value: "pen", icon: LuPen },
  { value: "eraser", icon: LuEraser },
  { value: "highlighter", icon: LuHighlighter },
];

export const Toolbar: FC<ToolbarProps> = ({
  strokes,
  currentStroke,
  handleClear,
  handleUndo,
  color,
  size,
  tool,
  onColorChange,
  onSizeChange,
  onToolChange,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {TOOLS.map(({ value, icon: Icon }) => (
        <Button
          key={value}
          variant={tool === value ? "ghost" : "outline"}
          onClick={() => onToolChange(value)}
        >
          <Icon />
        </Button>
      ))}

      <input
        type="color"
        value={color}
        onChange={(e) => onColorChange(e.target.value)}
        className="w-8 h-8 rounded cursor-pointer"
      />

      <input
        type="range"
        min={2}
        max={40}
        value={size}
        onChange={(e) => onSizeChange(Number(e.target.value))}
      />

      <Button
        variant="outline"
        onClick={handleUndo}
        disabled={strokes.length === 0}
      >
        <LuRotateCcw />
        Undo
      </Button>

      <Button
        variant="outline"
        onClick={handleClear}
        disabled={strokes.length === 0 && currentStroke.length === 0}
      >
        <LuTrash2 />
        Clear
      </Button>
    </div>
  );
};
