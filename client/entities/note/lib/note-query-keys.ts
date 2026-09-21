export const notesKeys = {
  all: ["notes"] as const,

  details: () => [...notesKeys.all, "detail"] as const,

  detail: (id: string) => [...notesKeys.details(), id] as const,
};
