export const notesKeys = {
  all: ["notes"] as const,

  lists: () => [...notesKeys.all, "list"] as const,

  list: (materialId: string) => [...notesKeys.lists(), materialId] as const,

  details: () => [...notesKeys.all, "detail"] as const,

  detail: (id: string) => [...notesKeys.details(), id] as const,

  // Saves of one note, so work that reads the stored text can wait for them
  update: (id: string) => [...notesKeys.all, "update", id] as const,
};
