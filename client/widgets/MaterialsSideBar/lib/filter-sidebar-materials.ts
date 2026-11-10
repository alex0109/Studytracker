import { IMaterialResponse } from "@/entities/material";

// By title, subject or the title of one of its notes; then by the chosen subject
export const filterSidebarMaterials = (
  materials: IMaterialResponse[],
  query: string,
  subjectId: string | null,
): IMaterialResponse[] => {
  const normalized = query.trim().toLocaleLowerCase();

  return materials.filter((material) => {
    if (subjectId && !material.materialTags?.some((tag) => tag.id === subjectId)) return false;
    if (!normalized) return true;

    return (
      material.title.toLocaleLowerCase().includes(normalized) ||
      (material.materialTags ?? []).some((tag) => tag.name.toLocaleLowerCase().includes(normalized)) ||
      (material.notes ?? []).some((note) => note.title.toLocaleLowerCase().includes(normalized))
    );
  });
};
