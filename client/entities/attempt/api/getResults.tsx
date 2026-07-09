import axios from "axios";
import { IAttempt } from "../model";

export const getResults = async (
  token: string | undefined,
  attemptId: string,
): Promise<IAttempt> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/attempts/${attemptId}/results`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
