export const questionKeys = {
  all: ["questions"] as const,

  lists: () => [...questionKeys.all, "list"] as const,

  list: (materialId: string) => [...questionKeys.lists(), materialId] as const,

  details: () => [...questionKeys.all, "detail"] as const,

  detail: (materialId: string, id: string) =>
    [...questionKeys.details(), materialId, id] as const,
};
