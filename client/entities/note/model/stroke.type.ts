export interface IStroke {
  id: string;
  points: [x: number, y: number, pressure: number][];
  color: string;
  size: number;
  tool: "pen" | "eraser" | "highlighter";
}
