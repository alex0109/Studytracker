export const attemptKeys = {
  all: ["attempts"] as const,

  details: () => [...attemptKeys.all, "detail"] as const,

  detail: (id: string) => [...attemptKeys.details(), id] as const,

  finished: (materialId: string) =>
    [...attemptKeys.all, "finished", materialId] as const,
};
