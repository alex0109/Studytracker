import axios from "axios";
import { IFlashcardSessionCreate, IFlashcardSessionResponse } from "../model";

export const startFlashcardSession = async (
  token: string | undefined,
  dictionaryId: string,
  body: IFlashcardSessionCreate,
): Promise<IFlashcardSessionResponse> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/dictionaries/${dictionaryId}/flashcards/sessions`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};
