import axios from "axios";
import type { IQuestionResponse } from "@/entities/question";
import { IQuestionGenerate } from "../model";

export const generateQuestions = async (
  token: string | undefined,
  materialId: string,
  body: IQuestionGenerate,
): Promise<IQuestionResponse[]> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/ai/materials/${materialId}/questions`,
    body,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return res.data;
};
