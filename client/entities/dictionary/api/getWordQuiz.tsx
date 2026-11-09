import axios from "axios";
import { IWordQuiz } from "../model";

export const getWordQuiz = async (token: string | undefined, entryId: string): Promise<IWordQuiz> => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_HTTP}/dictionaries/entries/${entryId}/quiz`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};
