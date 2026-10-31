import axios from "axios";
import { IQuestionResponse } from "@/entities/question";

export const getDictionaryQuestions = async (
  token: string | undefined,
  dictionaryId: string,
): Promise<IQuestionResponse[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/dictionaries/${dictionaryId}/questions`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
