import type { MaterialStatusEnum } from "./material-status.type";
import type { MaterialTypeEnum } from "./material-type.type";

// Order of the options in selects; labels are translation keys under "materials.types" and "materials.statuses"
export const MATERIAL_TYPES = ["article", "video", "practice", "test"] as const satisfies readonly `${MaterialTypeEnum}`[];

export const MATERIAL_STATUSES = ["tolearn", "inprocess", "finished"] as const satisfies readonly `${MaterialStatusEnum}`[];
