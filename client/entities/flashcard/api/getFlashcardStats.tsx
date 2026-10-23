import axios from "axios";
import { IFlashcardStats } from "../model";

export const getFlashcardStats = async (
  token: string | undefined,
  dictionaryId: string,
): Promise<IFlashcardStats> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/dictionaries/${dictionaryId}/flashcards/stats`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
