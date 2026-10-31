import { IDictionaryEntryResponse } from "./dictionary-entry-response.type";

export interface IDictionaryResponse {
  id: string;
  materialId: string;
  title: string;
  description?: string;
  entries?: IDictionaryEntryResponse[];
  createdAt: Date;
  updatedAt: Date;
}
