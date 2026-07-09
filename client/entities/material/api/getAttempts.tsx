import axios from "axios";
import { IAttempt } from "@/entities/attempt";

export const getAttempts = async (
  token: string | undefined,
  id: string,
): Promise<IAttempt[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${id}/attempts`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
