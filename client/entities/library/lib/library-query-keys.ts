import { ILibraryPageParams } from "../model";

export const libraryKeys = {
  all: ["library"] as const,

  lists: () => [...libraryKeys.all, "list"] as const,

  list: (params: ILibraryPageParams) => [...libraryKeys.lists(), params] as const,

  detail: (id: string) => [...libraryKeys.all, "detail", id] as const,

  requests: () => [...libraryKeys.all, "requests"] as const,
};
