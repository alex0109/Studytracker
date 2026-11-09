import axios from "axios";
import type { IQuestionReduced } from "@/entities/question/@x/attempt";

// The questions drawn for the attempt, in the order they are shown and with the choices already
// shuffled for it. The order stays the same on every load of the attempt
export const getAttemptQuestions = async (
  token: string | undefined,
  attemptId: string,
): Promise<IQuestionReduced[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/attempts/${attemptId}/questions`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
