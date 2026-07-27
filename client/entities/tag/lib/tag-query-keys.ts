export const tagKeys = {
  all: ["tags"] as const,

  details: () => [...tagKeys.all, "detail"] as const,

  detail: (id: string) => [...tagKeys.details(), id] as const,
};
