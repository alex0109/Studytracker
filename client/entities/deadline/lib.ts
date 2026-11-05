export const deadlineKeys = {
  all: ["deadlines"] as const,

  list: () => [...deadlineKeys.all, "list"] as const,

  plan: (materialId: string) => [...deadlineKeys.all, "plan", materialId] as const,
};
