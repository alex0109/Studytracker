import axios from "axios";
import { IDictionaryEntryCreate, IDictionaryEntryResponse } from "../model";

export const createDictionaryEntry = async (
  token: string | undefined,
  dictionaryId: string,
  body: IDictionaryEntryCreate,
): Promise<IDictionaryEntryResponse> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/dictionaries/${dictionaryId}/entries`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};
