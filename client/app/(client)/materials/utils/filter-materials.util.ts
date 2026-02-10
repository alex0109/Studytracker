import { TUpdateMaterial } from "@/app/types/types";

export const filteredMaterials = (data: TUpdateMaterial[], title: string) => {
  return data.filter((material) => {
    return title.toLowerCase() === ""
      ? material
      : material.title!.toLowerCase().includes(title.toLowerCase().trim());
  });
};
