export const limitsKeys = {
  all: ["limits"] as const,

  usage: () => [...limitsKeys.all, "usage"] as const,
};
