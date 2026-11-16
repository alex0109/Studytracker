export const videoKeys = {
  all: ["videos"] as const,

  material: (materialId: string) => [...videoKeys.all, materialId] as const,
};
