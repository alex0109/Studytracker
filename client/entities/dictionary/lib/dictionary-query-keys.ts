export const dictionaryKeys = {
  all: ["dictionaries"] as const,

  lists: () => [...dictionaryKeys.all, "list"] as const,

  list: (materialId: string) =>
    [...dictionaryKeys.lists(), materialId] as const,

  details: () => [...dictionaryKeys.all, "detail"] as const,

  detail: (id: string) => [...dictionaryKeys.details(), id] as const,

  questions: (id: string) =>
    [...dictionaryKeys.detail(id), "questions"] as const,

  entries: () => [...dictionaryKeys.all, "entry"] as const,

  entry: (entryId: string) => [...dictionaryKeys.entries(), entryId] as const,
};
