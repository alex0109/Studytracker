export const assessmentKeys = {
  all: ["assessments"] as const,

  lists: () => [...assessmentKeys.all, "list"] as const,

  list: (materialId: string) =>
    [...assessmentKeys.lists(), materialId] as const,

  details: () => [...assessmentKeys.all, "detail"] as const,

  detail: (materialId: string, id: string) =>
    [...assessmentKeys.details(), materialId, id] as const,
};
