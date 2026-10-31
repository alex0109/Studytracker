import axios from "axios";

export const undoFlashcardReview = async (
  token: string | undefined,
  sessionId: string,
  reviewId: string,
): Promise<boolean> => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_HTTP}/dictionaries/flashcards/sessions/${sessionId}/reviews/${reviewId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
