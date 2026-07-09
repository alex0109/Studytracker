import axios from "axios";
import { IQuestionResponse } from "../model";

export const getAllQuestions = async (
  token: string | undefined,
  materialId: string,
): Promise<IQuestionResponse[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${materialId}/questions`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
