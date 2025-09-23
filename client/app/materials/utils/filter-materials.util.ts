import { MaterialType } from "@/app/types/types";

export const filteredMaterials = (
  data: MaterialType[],
  title: string,
  status?: "tolearn" | "inprocess" | "finished"
) => {
  return data.filter((material) => {
    return title.toLowerCase() === ""
      ? material
      : material.title.toLowerCase().includes(title.toLowerCase().trim());
  });
};
