import { IMaterial } from "@/app/types/types";

export const filteredMaterials = (data: IMaterial[], title: string) => {
  return data.filter((material) => {
    return title.toLowerCase() === ""
      ? material
      : material.title!.toLowerCase().includes(title.toLowerCase().trim());
  });
};
