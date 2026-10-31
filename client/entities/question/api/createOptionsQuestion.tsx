import axios from "axios";
import { IOptionsQuestionRequest, IQuestionResponse } from "../model";

export const createOptionsQuestion = async (
  token: string | undefined,
  materialId: string,
  body: IOptionsQuestionRequest,
  noteId?: string,
): Promise<IQuestionResponse> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${materialId}/questions/options`,
    { ...body, noteId: noteId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};
