import axios from "axios";
import { IQuestionReduced } from "../model";

export const getAllReducedQuestions = async (
  token: string | undefined,
  materialId: string,
): Promise<IQuestionReduced[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${materialId}/questions/reduced`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
