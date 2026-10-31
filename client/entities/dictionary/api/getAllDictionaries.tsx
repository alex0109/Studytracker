import axios from "axios";
import { IDictionaryResponse } from "../model";

export const getAllDictionaries = async (
  token: string | undefined,
  materialId: string,
): Promise<IDictionaryResponse[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/dictionaries/materials/${materialId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
