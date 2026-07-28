import { IMaterialResponse } from "@/entities/material";

export const filteredMaterials = (data: IMaterialResponse[], query: string) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return data;

  return data.filter((material) => {
    const title = material.title?.toLowerCase() ?? "";
    const tags =
      material.materialTags?.map((tag) => tag.name?.toLowerCase() ?? "") ?? [];

    return (
      title.includes(normalizedQuery) ||
      tags.some((tag) => tag.includes(normalizedQuery))
    );
  });
};
