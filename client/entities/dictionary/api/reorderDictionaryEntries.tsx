import axios from "axios";
import { IDictionaryEntriesReorder, IDictionaryEntryResponse } from "../model";

export const reorderDictionaryEntries = async (
  token: string | undefined,
  dictionaryId: string,
  body: IDictionaryEntriesReorder,
): Promise<IDictionaryEntryResponse[]> => {
  const res = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_HTTP}/dictionaries/${dictionaryId}/entries/reorder`,
    body,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
