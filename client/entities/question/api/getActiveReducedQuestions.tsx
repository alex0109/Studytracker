import axios from "axios";
import { IQuestionReduced } from "../model";

export const getActiveReducedQuestions = async (
  token: string | undefined,
  materialId: string,
): Promise<IQuestionReduced[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${materialId}/questions/reduced/active`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
