import axios from "axios";
import { IFlashcardSessionSummary } from "../model";

export const getFlashcardSession = async (
  token: string | undefined,
  sessionId: string,
): Promise<IFlashcardSessionSummary> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/dictionaries/flashcards/sessions/${sessionId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
