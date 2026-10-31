import axios from "axios";
import { IDictionaryEntryResponse } from "../model";

export const getDictionaryEntry = async (
  token: string | undefined,
  entryId: string,
): Promise<IDictionaryEntryResponse> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/dictionaries/entries/${entryId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
