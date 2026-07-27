import axios from "axios";
import { IQuestionResponse } from "../model";

export const getQuestion = async (
  token: string | undefined,
  materialId: string,
  id: string,
): Promise<IQuestionResponse> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${materialId}/questions/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
