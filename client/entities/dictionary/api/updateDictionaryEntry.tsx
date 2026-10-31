import axios from "axios";
import { IDictionaryEntryResponse, IDictionaryEntryUpdate } from "../model";

export const updateDictionaryEntry = async (
  token: string | undefined,
  entryId: string,
  dataToUpdate: IDictionaryEntryUpdate,
): Promise<IDictionaryEntryResponse> => {
  const res = await axios.put(
    `${process.env.NEXT_PUBLIC_API_HTTP}/dictionaries/entries/${entryId}`,
    dataToUpdate,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
