import axios from "axios";
import { IEssayReviewResponse } from "../model";

export const reviewEssay = async (
  token: string | undefined,
  materialId: string,
  noteId: string,
): Promise<IEssayReviewResponse> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/ai/materials/${materialId}/notes/${noteId}/essay-review`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return res.data;
};
