import axios from "axios";
import type { IDictionaryEntryResponse } from "@/entities/dictionary/model";
import { IDictionaryEntriesGenerate } from "../model";

export const generateDictionaryEntries = async (
  token: string | undefined,
  dictionaryId: string,
  body: IDictionaryEntriesGenerate,
): Promise<IDictionaryEntryResponse[]> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/ai/dictionaries/${dictionaryId}/entries`,
    body,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return res.data;
};
