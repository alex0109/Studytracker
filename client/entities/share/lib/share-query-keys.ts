export const shareKeys = {
  all: ["shares"] as const,

  material: (materialId: string) =>
    [...shareKeys.all, "material", materialId] as const,

  preview: (shareToken: string, userId?: string) =>
    [...shareKeys.all, "preview", shareToken, userId ?? "anonymous"] as const,
};
