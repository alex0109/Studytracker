import axios from "axios";
import { IQuestionResponse, ITrueFalseQuestionRequest } from "../model";

export const createTrueFalseQuestion = async (
  token: string | undefined,
  materialId: string,
  body: ITrueFalseQuestionRequest,
  noteId?: string,
): Promise<IQuestionResponse> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${materialId}/questions/true-false`,
    { ...body, noteId: noteId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};
