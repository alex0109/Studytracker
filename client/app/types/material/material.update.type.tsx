import { IMaterial } from "./material.type";

export type TUpdateMaterial = Partial<IMaterial> & {
  id: string;
};
