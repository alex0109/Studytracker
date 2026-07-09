import axios from "axios";
import { IAttempt } from "../model";

export const finishAttempt = async (
  token: string | undefined,
  attemptId: string,
): Promise<IAttempt> => {
  const res = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_HTTP}/attempts/${attemptId}/finish`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
