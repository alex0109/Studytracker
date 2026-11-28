export const reviewKeys = {
  all: ["review"] as const,

  today: () => [...reviewKeys.all, "today"] as const,
  summary: () => [...reviewKeys.all, "today", "summary"] as const,
};
