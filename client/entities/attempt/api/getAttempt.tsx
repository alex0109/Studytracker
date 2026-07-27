import axios from "axios";
import { IAttempt } from "../model";

export const getAttempt = async (
  token: string | undefined,
  id: string,
): Promise<IAttempt> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/attempts/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
