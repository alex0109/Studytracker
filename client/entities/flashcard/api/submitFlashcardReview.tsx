import axios from "axios";
import { IFlashcardReviewCreate, IFlashcardReviewResponse } from "../model";

export const submitFlashcardReview = async (
  token: string | undefined,
  sessionId: string,
  body: IFlashcardReviewCreate,
): Promise<IFlashcardReviewResponse> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/dictionaries/flashcards/sessions/${sessionId}/reviews`,
    body,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
