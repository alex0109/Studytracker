import axios from "axios";
import { INoteCreate, INoteResponse } from "../model";

export const createNote = async (
  token: string | undefined,
  materialId: string,
  body: INoteCreate,
): Promise<INoteResponse> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${materialId}/notes`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};
