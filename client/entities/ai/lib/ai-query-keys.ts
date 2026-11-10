export const aiKeys = {
  all: ["ai"] as const,

  usage: () => [...aiKeys.all, "usage"] as const,

  // Kept in memory for the visit only: opening the same word again costs nothing
  wordExplanation: (entryId: string) => [...aiKeys.all, "word-explanation", entryId] as const,
};
