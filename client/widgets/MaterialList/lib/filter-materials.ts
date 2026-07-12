import { IMaterialResponse } from "@/entities/material";

export const filteredMaterials = (data: IMaterialResponse[], title: string) => {
  return data.filter((material) => {
    return title.toLowerCase() === ""
      ? material
      : material.title!.toLowerCase().includes(title.toLowerCase().trim());
  });
};
