import axios from "axios";
import { INoteResponse } from "../model";

export const getNote = async (
  token: string | undefined,
  materialId: string,
  noteId: string,
): Promise<INoteResponse> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${materialId}/notes/${noteId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
