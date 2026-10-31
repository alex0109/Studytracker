import axios from "axios";
import { ISummaryGenerateResponse } from "../model";

export const generateSummary = async (
  token: string | undefined,
  materialId: string,
  noteId: string,
): Promise<ISummaryGenerateResponse> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/ai/materials/${materialId}/notes/${noteId}/summary`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return res.data;
};
