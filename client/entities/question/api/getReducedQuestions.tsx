import axios from "axios";
import { IQuestionReduced } from "../model";

export const getReducedQuestions = async (
  token: string | undefined,
  materialId: string,
): Promise<IQuestionReduced[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${materialId}/questions/assessment`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
