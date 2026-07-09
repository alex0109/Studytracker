export const attemptKeys = {
  all: ["assessments"] as const,

  details: () => [...attemptKeys.all, "detail"] as const,

  detail: (id: string) => [...attemptKeys.details(), id] as const,
};
