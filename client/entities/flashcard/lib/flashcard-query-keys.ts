export const flashcardKeys = {
  all: ["flashcards"] as const,

  stats: (dictionaryId: string) =>
    [...flashcardKeys.all, "stats", dictionaryId] as const,

  sessions: () => [...flashcardKeys.all, "session"] as const,

  session: (sessionId: string) =>
    [...flashcardKeys.sessions(), sessionId] as const,
};
