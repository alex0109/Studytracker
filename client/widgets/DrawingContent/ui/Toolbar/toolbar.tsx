import React, { FC } from "react";
import { Button } from "@/shared/radix-ui";
import { LuRotateCcw, LuTrash2 } from "react-icons/lu";
import { Point, Stroke } from "../../model";

interface ToolbarProps {
  strokes: Stroke[];
  currentStroke: Point[];
  handleUndo: () => void;
  handleClear: () => void;
}

export const Toolbar: FC<ToolbarProps> = ({
  strokes,
  currentStroke,
  handleClear,
  handleUndo,
}) => {
  return (
    <div className="flex items-center gap-2">
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
