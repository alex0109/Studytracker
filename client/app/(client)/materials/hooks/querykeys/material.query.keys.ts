export const materialKeys = {
  all: ["materials"] as const,

  details: () => [...materialKeys.all, "detail"] as const,

  detail: (id: string) => [...materialKeys.details(), id] as const,
};
