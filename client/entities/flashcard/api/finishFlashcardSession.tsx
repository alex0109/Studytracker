import axios from "axios";
import { IFlashcardSessionSummary } from "../model";

export const finishFlashcardSession = async (
  token: string | undefined,
  sessionId: string,
): Promise<IFlashcardSessionSummary> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/dictionaries/flashcards/sessions/${sessionId}/finish`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
