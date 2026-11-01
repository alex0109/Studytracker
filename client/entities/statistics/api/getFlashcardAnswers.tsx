import axios from "axios";
import { IFlashcardAnswers } from "../model/flashcard-answers";

export const getFlashcardAnswers = async (
  token: string | undefined,
  days: number,
): Promise<IFlashcardAnswers> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/statistics/flashcards`,
    {
      params: { days },
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
