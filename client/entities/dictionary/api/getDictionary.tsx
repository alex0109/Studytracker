import axios from "axios";
import { IDictionaryResponse } from "../model";

export const getDictionary = async (
  token: string | undefined,
  dictionaryId: string,
): Promise<IDictionaryResponse> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/dictionaries/${dictionaryId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
