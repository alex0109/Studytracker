import axios from "axios";
import { INoteResponse, INoteUpdate } from "../model";

export const updateNote = async (
  token: string | undefined,
  materialId: string,
  noteId: string,
  dataToUpdate: INoteUpdate,
): Promise<INoteResponse> => {
  const res = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${materialId}/notes/${noteId}`,
    dataToUpdate,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
