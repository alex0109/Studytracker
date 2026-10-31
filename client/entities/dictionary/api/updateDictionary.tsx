import axios from "axios";
import { IDictionaryResponse, IDictionaryUpdate } from "../model";

export const updateDictionary = async (
  token: string | undefined,
  dictionaryId: string,
  dataToUpdate: IDictionaryUpdate,
): Promise<IDictionaryResponse> => {
  const res = await axios.put(
    `${process.env.NEXT_PUBLIC_API_HTTP}/dictionaries/${dictionaryId}`,
    dataToUpdate,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
