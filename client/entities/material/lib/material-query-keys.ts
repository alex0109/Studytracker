export const materialKeys = {
  all: ["materials"] as const,

  details: () => [...materialKeys.all, "detail"] as const,

  detail: (id: string) => [...materialKeys.details(), id] as const,

  attempts: (id: string) => [...materialKeys.detail(id), "attempts"] as const,
};
