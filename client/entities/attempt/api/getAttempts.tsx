import axios from "axios";
import { IAttempt } from "@/entities/attempt";

export const getFinishedAttempts = async (
  token: string | undefined,
  materialId: string,
): Promise<IAttempt[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/attempts/m/${materialId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
