import axios from "axios";
import { IResultExplanation } from "../model";

export const explainMistakes = async (
  token: string | undefined,
  attemptId: string,
): Promise<IResultExplanation[]> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/ai/attempts/${attemptId}/explanations`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return res.data;
};
