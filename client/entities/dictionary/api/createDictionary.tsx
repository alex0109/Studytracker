import axios from "axios";
import { IDictionaryCreate, IDictionaryResponse } from "../model";

export const createDictionary = async (
  token: string | undefined,
  materialId: string,
  body: IDictionaryCreate,
): Promise<IDictionaryResponse> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/dictionaries/materials/${materialId}`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};
