import type { MaterialStatusEnum } from "./material-status.type";
import type { MaterialTypeEnum } from "./material-type.type";

// Order of the options in selects; labels are translation keys under "materials.types" and "materials.statuses"
// Grouped by what you do with them: read, listen and watch, then practise and check yourself
export const MATERIAL_TYPES = [
  "lecture",
  "topic",
  "book",
  "article",
  "document",
  "video",
  "podcast",
  "course",
  "practice",
  "test",
] as const satisfies readonly `${MaterialTypeEnum}`[];

export const MATERIAL_STATUSES = ["tolearn", "inprocess", "finished"] as const satisfies readonly `${MaterialStatusEnum}`[];
