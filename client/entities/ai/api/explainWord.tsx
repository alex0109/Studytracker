import axios from "axios";
import { IWordExplanation } from "../model";

export const explainWord = async (
  token: string | undefined,
  entryId: string,
): Promise<IWordExplanation> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/ai/dictionaries/entries/${entryId}/explanation`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return res.data;
};
