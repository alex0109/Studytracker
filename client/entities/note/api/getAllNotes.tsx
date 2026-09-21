import axios from "axios";
import { INoteResponse } from "../model";

export const getAllNotes = async (
  token: string | undefined,
  materialId: string,
): Promise<INoteResponse[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${materialId}/notes`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
