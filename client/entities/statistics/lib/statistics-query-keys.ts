export const statisticsKeys = {
  all: ["statistics"] as const,

  attemptTrend: () => [...statisticsKeys.all, "attemtTrend"] as const,

  difficultyBreakdown: () =>
    [...statisticsKeys.all, "difficultyBreakdown"] as const,

  confidenceLevel: () => [...statisticsKeys.all, "confidenceLevel"] as const,

  overview: () => [...statisticsKeys.all, "overview"] as const,

  studyStreak: () => [...statisticsKeys.all, "studyStreak"] as const,

  tagPerformance: () => [...statisticsKeys.all, "tagPerformance"] as const,
};
