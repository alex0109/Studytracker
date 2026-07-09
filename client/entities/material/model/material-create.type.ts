import { MaterialStatusEnum } from "./material.status.type";
import { MaterialTypeEnum } from "./material.type.type";

export interface IMaterialCreate {
  title: string;
  type: MaterialTypeEnum;
  status: MaterialStatusEnum;
}
