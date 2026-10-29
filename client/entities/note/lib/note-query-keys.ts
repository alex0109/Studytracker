export const notesKeys = {
  all: ["notes"] as const,

  lists: () => [...notesKeys.all, "list"] as const,

  list: (materialId: string) => [...notesKeys.lists(), materialId] as const,

  details: () => [...notesKeys.all, "detail"] as const,

  detail: (id: string) => [...notesKeys.details(), id] as const,
};
