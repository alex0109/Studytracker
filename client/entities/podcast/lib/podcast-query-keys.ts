export const podcastKeys = {
  all: ["podcasts"] as const,

  material: (materialId: string) => [...podcastKeys.all, materialId] as const,
};
