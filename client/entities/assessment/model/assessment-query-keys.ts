export const assessmentKeys = {
  all: ["assessments"] as const,

  details: () => [...assessmentKeys.all, "detail"] as const,

  detail: (id: string) => [...assessmentKeys.details(), id] as const,
};
